import Experience from "../Experience";
import * as THREE from 'three'

export default class Environment 
{
    constructor()
    {

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.ressources = this.experience.ressources
        this.debug = this.experience.debug

        //Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Environment')
        }

        this.setSunLight()
        this.setEnvironmentMap()
    }

    setSunLight()
    {
        this.sunLight = new THREE.DirectionalLight('#ffffff', 4)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(3.5, 2, - 1.25)
        this.scene.add(this.sunLight)

        // Debug
        if(this.debug.active)
        {
            this.debugFolder.add(this.sunLight, 'intensity', 0, 10, 0.001)
                .name('sunLightIntensity')
            this.debugFolder.add(this.sunLight.position, 'x', -5, 5, 0.001)
                .name('sunLightX')
            this.debugFolder.add(this.sunLight.position, 'y', -5, 5, 0.001)
                .name('sunLightY')
            this.debugFolder.add(this.sunLight.position, 'z', -5, 5, 0.001)
                .name('sunLightZ')
        }
    }

    setEnvironmentMap()
    {
        this.environmentMap = {}
        this.environmentMap.intensity = 0.4
        this.environmentMap.texture = this.ressources.items.environmentMapTexture
        this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace

        this.scene.environment = this.environmentMap.texture

        this.environmentMap.updateMaterials = () =>
        {
            this.scene.traverse((child)=>
            {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }

        this.environmentMap.updateMaterials()

        //Debug
        if(this.debug.active)
        {
            this.debugFolder.add(this.environmentMap, 'intensity', 0, 2, 0.001)
                .name('envMapIntensity')
                .onChange(this.environmentMap.updateMaterials)
        }
    }
}