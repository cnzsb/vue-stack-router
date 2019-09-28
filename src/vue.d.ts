import Vue, { Component } from 'vue';
import { Router } from './interface/router';
declare module 'vue/types/vue' {
  interface Vue {
    $router: Router<Component>;
  }
}
declare module 'vue/types/options' {
  interface ComponentOptions<
    V extends Vue> {
    willAppear?: (this: V) => void;
    didAppear?: (this: V) => void;
    willDisappear?: (this: V) => void;
    didDisappear?: (this: V) => void;
  }
}
