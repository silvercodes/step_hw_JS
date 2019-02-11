; 'use strict';

const FIELD_SIZE = 1000;
const CHIP_GAP = 20;
const CHIP_SIZE = FIELD_SIZE / 4;
const CHIP_DEPTH = 30;
const TEXT_SIZE = 80;

document.addEventListener('DOMContentLoaded', () => {
    let loader = new THREE.FontLoader();
    loader.load('/fonts/helvetiker_bold.typeface.json', (font) => {
        init(font);
    });
}, false);

function init(font) {

    const manager = new Manager(font);
    manager.init();

    // const axesHelper = new THREE.AxesHelper(300);
    // manager.scene.add(axesHelper);
}


//region class Manager
class Manager {
    constructor(font) {
        this.font = font;

        this.renderer = Manager.genRenderer();
        this.scene = new THREE.Scene();
        this.camera = Manager.genCamera(window.innerWidth / window.innerHeight);
        this.light = Manager.genLight(0xffffff);
        this.controls = new THREE.OrbitControls(this.camera);

        this.field = new Field(this.scene, font);
    }

    init() {
        this.scene.add(this.light);
        this.scene.add(this.field.mesh);

        this.updateEventListeners();

        this.render();
    }

    render() {
        this.controls.update();

        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(() => {this.render()});
    }

    updateEventListeners() {
        const mouse = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();
        const arrMeshes = this.field.getChipsAsMeshes();

        let startPos;
        let mouseDown = false;

        this.renderer.domElement.addEventListener('mousedown', (e) => {
            mouseDown = true;
            startPos = Object.assign({}, this.camera.position);
        }, true);

        this.renderer.domElement.addEventListener('mouseup', (e) => {
            mouseDown = false;
            if (JSON.stringify(this.camera.position) === JSON.stringify(startPos)) {
                e.preventDefault();

                let targetMesh;

                mouse.x = (e.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
                mouse.y = -(e.clientY / this.renderer.domElement.clientHeight) * 2 + 1;

                raycaster.setFromCamera(mouse, this.camera);

                let intersects = raycaster.intersectObjects(arrMeshes);

                if (intersects.length > 0) {
                    targetMesh = intersects[0].object;
                    let chip = this.field.findChipByMesh(targetMesh.parent);

                    this.field.moveChip(chip);
                }
            }
        }, true);

        this.renderer.domElement.addEventListener('mousemove', (e) => {
            if(mouseDown) {

            }
        });

        window.addEventListener('keydown', (e) => {
            if(e.code === 'Space')
                this.field.shuffleChips();
        });
    }
}
Manager.genRenderer = function() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const canvas = document.querySelector('#canvas');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);

    const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
    renderer.setClearColor(0x000000);

    return renderer;
};
Manager.genCamera = function(aspect) {
    let camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 5000);
    camera.position.set(-500, -1200, 1500);
    return camera;
};
Manager.genLight = function(color) {
    //return new THREE.AmbientLight(color);
    let l = new THREE.DirectionalLight(0x0088ff, 1.0);
    l.position.set(0.5, 0.5, 1).normalize();
    return l;
};
//endregion


//region class Field
class Field {
    constructor(scene, font) {
        this.font = font;

        this.scene = scene;
        this.mesh = Field.genMesh();
        this.chips = [];

        this.genChips(font);
        this.renderChips();
    }

    genChips(font) {
        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < 4; j++) {
                let chip = new Chip(i * 4 + j + 1, font);

                let half = CHIP_SIZE / 2;
                let x = j * CHIP_SIZE + half - FIELD_SIZE / 2;
                let y = -(i * CHIP_SIZE + half - FIELD_SIZE / 2);
                let z = CHIP_DEPTH / 2;

                chip.setPosition({x: x, y: y, z: z}, false);

                this.chips.push(chip);
            }
        }
        //this.chips.splice(15, 1);
        this.chips[15].mesh = null;
    }

    renderChips() {
        this.chips.forEach((c) => {
            if (c.mesh) {
                this.scene.add(c.mesh);
            }
        });
    }

    getChipsAsMeshes() {
        const arr = [];
        for (let i = 0; i < this.chips.length; i++) {
            if (this.chips[i].mesh) {
                arr.push(this.chips[i].mesh.children[0]);
            }
        }

        return arr;
    }

    findChipByMesh(mesh) {
        for(let i = 0; i < this.chips.length; i++) {
            if(this.chips[i].mesh === mesh)
                return this.chips[i];
        }

        return null;
    }

    moveChip(chip) {

        let meshes = [];
        for(let i = 0; i < this.chips.length; i++) {
            meshes.push(this.chips[i].mesh);
        }

        let nullId = meshes.indexOf(null);
        let chipId = this.chips.indexOf(chip);
        if(Math.abs(nullId - chipId) === 4 || Math.abs(nullId - chipId) === 1) {
            let chip = this.chips[chipId];
            let nullChip = this.chips[nullId];

            this.chips[nullId] = this.chips.splice(chipId, 1, this.chips[nullId])[0];

            let temp = {x: nullChip.pos.x, y: nullChip.pos.y, z: nullChip.pos.z};
            nullChip.setPosition({x: chip.pos.x, y: chip.pos.y, z: chip.pos.z});
            chip.setPosition(temp);
        }
    }

    async shuffleChips() {
        let steps = rnd(300, 500);
        for(let i = 0; i < steps; i++) {
            await sleep(5);

            let meshes = [];
            for(let i = 0; i < this.chips.length; i++) {
                meshes.push(this.chips[i].mesh);
            }

            let nullId = meshes.indexOf(null);
            let chipId = -1;

            let pairTwo = rnd(1, 2);
            let sign = rnd (-1, 1);

            if(pairTwo === 1) {
                chipId = nullId + sign;
                if(sign && chipId < 16 && this.chips[chipId]) {
                    this.moveChip(this.chips[chipId])
                }
            }
            else if(pairTwo === 2) {
                chipId = nullId + sign * 4;
                if(sign && chipId < 16 && this.chips[chipId]) {
                    this.moveChip(this.chips[chipId])
                }
            }
        }
    }
}
Field.genMesh = function() {
    let planeGeo = new THREE.PlaneGeometry(FIELD_SIZE, FIELD_SIZE);
    let planeMat = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide, wireframe: true} );
    let plane = new THREE.Mesh(planeGeo, planeMat);

    return plane;
};
//endregion


//region class Chip
class Chip {
    constructor(num, font) {
        this.num = num;
        this.depth = CHIP_DEPTH;
        this.pos = {x: 0, y: 0, z: 0};

        this.mesh = this.genMesh(font);
    }

    setPosition(p, isAnimate = true) {
        this.pos.x = p.x;
        this.pos.y = p.y;
        this.pos.z = p.z;

        if (this.mesh) {
            if(isAnimate) {
                this.animate();
            }
            else {
                this.mesh.position.x = this.pos.x;
                this.mesh.position.y = this.pos.y;
                this.mesh.position.z = this.pos.z;
            }
        }
    }

    animate() {
        var currentPos = new THREE.Vector3();
        this.mesh.parent.updateMatrixWorld();
        currentPos.setFromMatrixPosition( this.mesh.children[0].matrixWorld );


        let diffX = this.pos.x - currentPos.x;
        let dx = diffX ? diffX / Math.abs(diffX) : 0;

        let diffY = this.pos.y - currentPos.y;
        let dy = diffY ? diffY / Math.abs(diffY) : 0;

        this.mesh.position.x += dx * 25;
        this.mesh.position.y += dy * 25;

        let raf = requestAnimationFrame(() => {this.animate()});

        if(currentPos.x === this.pos.x && currentPos.y === this.pos.y)
            window.cancelAnimationFrame(raf);
    }

    genMesh (font) {
        let chipGeo = new THREE.BoxGeometry(CHIP_SIZE - CHIP_GAP, CHIP_SIZE - CHIP_GAP, CHIP_DEPTH);
        let chipMat = new THREE.MeshPhongMaterial( {
            color: 0x0000ff,
            emissive: 0x2a0000,
            shininess: 20,
            specular: 0xbbbbbb,
            wireframe: false
        });
        let chipMesh = new THREE.Mesh(chipGeo, chipMat);

        let textGeo = new THREE.TextGeometry(`${this.num}`, {
            font: font,
            size: TEXT_SIZE,
            height: 2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 5,
            bevelSize: 8,
            bevelSegments: 5
        });
        let textMat = new THREE.MeshPhongMaterial({
            color: 0x999999,
            emissive: 0x2a0000,
            shininess: 30,
            specular: 0xbbbbbb,
        });

        let textMesh = new THREE.Mesh(textGeo, textMat);

        let sizeBox = new THREE.Box3().setFromObject(textMesh);
        let w = sizeBox.max.x ;
        let h = sizeBox.max.y;

        textMesh.position.x = - w / 2;
        textMesh.position.y = - h / 2;
        textMesh.position.z = CHIP_DEPTH / 2;

        let group = new THREE.Group();
        group.add( chipMesh );
        group.add( textMesh );

        return group;
    };
}
//endregion

function rnd(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}