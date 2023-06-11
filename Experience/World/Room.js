import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

export default class Room {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.room = this.resources.items.room;
    this.actualRoom = this.room.scene;
    this.roomChildren = {};

    this.lerp = {
      current: 0,
      target: 0,
      ease: 0.1,
    };

    this.setModel();
    this.setAnimation();
    this.onMouseMove();
  }

  setModel() {
    this.actualRoom.children.forEach((child) => {
      child.castShadow = true;
      child.receiveShadow = true;

      if (child instanceof THREE.Group) {
        child.children.forEach((groupchild) => {
          console.log(groupchild.material);
          groupchild.castShadow = true;
          groupchild.receiveShadow = true;
        });
      }

      if (child.name === "screenmonitor") {
        child.material = new THREE.MeshBasicMaterial({
          map: this.resources.items.screen,
        });
      }

      if (child.name === "mini_floor") {
        child.position.x = -3.3;
        child.position.z = 0;
      }

      if (
        child.name === "mailbox" ||
        child.name === "yardlamp" ||
        child.name === "mini1" ||
        child.name === "mini2" ||
        child.name === "mini3" ||
        child.name === "flower"
      ) {
        child.position.set(-3, 0, -0.4);
      }

      child.scale.set(0, 0, 0);
      if (child.name === "Cube") {
        child.scale.set(1, 1, 1);
        child.position.z = 2;
      }

      this.roomChildren[child.name.toLowerCase()] = child;
    });

    const width = 0.5;
    const height = 0.7;
    const intensity = 1;
    const rectLight = new THREE.RectAreaLight(
      0xffffff,
      intensity,
      width,
      height
    );
    rectLight.position.set(7.68244, 7, 0.5);
    rectLight.rotation.x = -Math.PI / 2;
    rectLight.rotation.z = Math.PI / 4;
    this.actualRoom.add(rectLight);

    this.roomChildren["rectLight"] = rectLight;

    // const rectLightHelper = new RectAreaLightHelper(rectLight);
    // rectLight.add(rectLightHelper);
    console.log(this.room);

    this.scene.add(this.actualRoom);
    this.actualRoom.scale.set(0.3, 0.3, 0.3);
  }

  setAnimation() {
    console.log(this.room);
    this.mixer = new THREE.AnimationMixer(this.actualRoom);
    this.fly = this.mixer.clipAction(this.room.animations[26]);
    this.fly1 = this.mixer.clipAction(this.room.animations[29]);
    this.fly2 = this.mixer.clipAction(this.room.animations[30]);
    this.fly3 = this.mixer.clipAction(this.room.animations[31]);
    this.fly4 = this.mixer.clipAction(this.room.animations[32]);
    this.fly.play();
    this.fly1.play();
    this.fly2.play();
    this.fly3.play();
    this.fly4.play();
  }

  onMouseMove() {
    window.addEventListener("mousemove", (e) => {
      this.rotation =
        ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth;
      this.lerp.target = this.rotation * 0.05;
    });
  }

  resize() {}

  update() {
    this.lerp.current = GSAP.utils.interpolate(
      this.lerp.current,
      this.lerp.target,
      this.lerp.ease
    );

    this.actualRoom.rotation.y = this.lerp.current;

    this.mixer.update(this.time.delta * 0.0009);
  }
}
