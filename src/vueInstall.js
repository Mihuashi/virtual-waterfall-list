import { isVue3, h, isVue2 } from 'vue-demi';
import Waterfall from './Waterfall';
import VirtualList from './VirtualList';
import { throttle } from './utils';

const virtualWaterFall = {
  props: {
    items: {
      type: Array,
      default: [],
    },
    maxHeight: {
      type: Number,
      default: null,
    },
    defaultItemSize: {
      type: Object,
      default() {
        return {
          height: 500,
          width: 500,
        };
      },
    },
  },
  data() {
    return {
      cacheItems: [],
      width: 0,
      initialized: false,
      waterfall: null,
    }
  },
  watch: {
    initialized(val) {
      if (val && this.cacheItems) {
        this.add(this.cacheItems);
        this.cacheItems = [];
      }
    }
  },
  methods: {
    add(items) {
      if (this.initialized) {
        this.waterfall.add(items);
        this.virtualList.setItems(this.waterfall);
        this.update();
      } else {
        this.cacheItems = this.cacheItems.concat(items);
      }
    },
    clear() {
      this.virtualList.clear();
      this.waterfall.clear();
      this.update();
    },
    update() {
      this.$forceUpdate();
    }
  },
  mounted() {
    this.width = this.$el.getBoundingClientRect().width;
    this.waterfall = new this.$Waterfall(this.items, { width: this.width, maxHeight: this.maxHeight, defaultItemSize: this.defaultItemSize });
    this.virtualList = new VirtualList(this.$el, this.waterfall);
    this.initialized = true;
    this.virtualList.on('change', this.update.bind(this));

    this.reDraw = throttle(() => {
      this.width = this.$el.getBoundingClientRect().width;
      this.waterfall.width = this.width;
      this.waterfall.calculateAll();
      this.virtualList.initOffsetTop();
      this.virtualList.setItems(this.waterfall);
      this.update();
    }, 200);

    window.addEventListener('resize', this.reDraw);
    this.observe = new MutationObserver(() => {
      const { width } = this.$el.getBoundingClientRect();
      if (width !== this.width) this.reDraw();
    });
    this.observe.observe(this.$el, {
      attributes: true,
    });
  },
  destroyed() {
    this.observe.disconnect();
  },
  render(createElement) {
    let slot = isVue3 ? this.$slots.default : this.$scopedSlots.default;
    const _h = isVue3 ? h : createElement;
    return _h('div', {
      staticClass: 'virtual-list',
      style: {
        position: 'relative',
        height: `${this.waterfall && this.waterfall.height}px`
      }
    }, this.width ? slot({ nowItems: this.virtualList ? this.virtualList.viewItems : [] }) : []);
  },
}

if (isVue3) {
  virtualWaterFall.unmounted = virtualWaterFall.destroyed;
  delete virtualWaterFall.destroyed;
}

export default {
  install: (vue) => {
    isVue3
    ? Object.defineProperty(vue.config.globalProperties, '$Waterfall', {
      value: Waterfall,
    })
    : Object.defineProperty(vue.prototype, '$Waterfall', {
      value: Waterfall
    })
    vue.component('virtualWaterfall', virtualWaterFall);
  }
}
