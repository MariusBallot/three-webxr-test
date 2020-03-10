import RAF from '../utils/raf'
import * as THREE from 'three'

class WebXRController {

    constructor() {
        this.bind()
        this.session = null;
        this.xrViewerSpace = null;
        this.xrHitTestSource = null;
        this.xrRefSpace = null;

    }

    initXR() {
        if (!window.isSecureContext) {
            let message = "WebXR unavailable due to insecure context";
            console.log(message)
        }

        if (navigator.xr) {
            console.log(navigator.xr)
        }

    }

    onRequest() {
        if (!this.session) {
            navigator.xr.requestSession('immersive-ar', { requiredFeatures: ['local', 'hit-test'] }).then(this.onSessionStarted);
            // ThreeScene.init()
        } else {
            this.session.end();
        }
    }

    onSessionStarted(session) {
        this.session = session;

        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            preserveDrawingBuffer: true,
        });
        this.renderer.autoClear = false;
        this.gl = this.renderer.getContext();

        this.gl.xrCompatible = true

        this.session.baseLayer = new XRWebGLLayer(this.session, this.gl);


        this.camera = new THREE.PerspectiveCamera();
        this.camera.matrixAutoUpdate = false;

        this.scene = this.createScene()

        session.updateRenderState({ baseLayer: new XRWebGLLayer(session, this.gl) });

        // session.requestReferenceSpace('viewer').then((refSpace) => {
        //     this.xrViewerSpace = refSpace;
        //     session.requestHitTestSource({ space: this.xrViewerSpace }).then((hitTestSource) => {
        //         this.xrHitTestSource = hitTestSource;
        //     });
        // });

        session.requestReferenceSpace('local').then((refSpace) => {
            this.xrRefSpace = refSpace;

            session.requestAnimationFrame(this.onXRFrame);
        });
    }



    onXRFrame(time, frame) {
        let session = frame.session;
        let pose = frame.getViewerPose(this.xrRefSpace);
        // console.log(frame)

        // if (this.xrHitTestSource && pose) {
        //     let hitTestResults = frame.getHitTestResults(this.xrHitTestSource);
        //     if (hitTestResults.length > 0) {
        //         let pose = hitTestResults[0].getPose(xrRefSpace);
        //         reticle.visible = true;
        //         reticle.matrix = pose.transform.matrix;
        //     }
        // }

        session.requestAnimationFrame(this.onXRFrame);

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.session.baseLayer.framebuffer);

        if (pose) {
            console.log(this.xrRefSpace)
            for (let view of pose.views) {
                const viewport = this.session.baseLayer.getViewport(view);
                this.renderer.setSize(viewport.width, viewport.height);


                this.camera.projectionMatrix.fromArray(view.projectionMatrix);
                // const viewMatrix = new THREE.Matrix4().fromArray(pose.views[0].projectionMatrix);
                // this.camera.matrix.getInverse(viewMatrix);
                // this.camera.updateMatrixWorld(true);

                // this.renderer.clearDepth();

                // this.renderer.render(this.scene, this.camera);
            }
        }
    }



    createScene() {
        let scene = new THREE.Scene()

        let light = new THREE.AmbientLight()
        let pointLight = new THREE.PointLight()
        pointLight.position.set(10, 10, 0)
        scene.add(light, pointLight)

        for (let i = 0; i < Math.PI * 2; i += Math.PI * 2 / 20) {
            let cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial())
            let radius = 10
            let x = Math.cos(i) * radius
            let z = Math.sin(i) * radius

            cube.position.set(x, 0, z)
            scene.add(cube)
        }

        return this.scene
    }

    bind() {
        this.initXR = this.initXR.bind(this)
        this.onRequest = this.onRequest.bind(this)
        this.onSessionStarted = this.onSessionStarted.bind(this)
        this.onXRFrame = this.onXRFrame.bind(this)
        this.createScene = this.createScene.bind(this)
    }
}


const _instance = new WebXRController()
export default _instance