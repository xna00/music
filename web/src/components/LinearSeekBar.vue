<template>
  <div class="seekbar" ref="bar">
    <div class="process" ref="processElement"></div>
    <div class="indicator" ref="indicator"></div>
  </div>
</template>
<script lang="ts">
// @ts-nocheck
import { onMounted, ref, watchEffect } from "vue";
export default {
  props: {
    process: {
      type: Number,
      default: 0,
    },
    backgroundColor: {
      type: String,
      default: "black",
    },
    color: {
      type: String,
      default: "red",
    },
    indicatiorColor: {
      type: String,
      default: "green",
    },
  },
  setup(props, context) {
    const bar = ref<HTMLDivElement>();
    const indicator = ref<HTMLDivElement>();
    const processElement = ref<HTMLDivElement>();
    let active = false;
    onMounted(() => {
      bar.value.style.background = props.backgroundColor;
      // bar.value.style.height = props.barHeight + "px";
      // bar.value.style.width = props.barWidth + "px";
      // bar.value.style.borderRadius =

      //   bar.value.getClientRects()[0].height / 2 + "px";
      processElement.value.style.background = props.color;
      // processElement.value.style.height = props.barHeight + "px";
      indicator.value.style.background = props.indicatiorColor;
      // indicator.value.style.width = indicator.value.style.height =
      //   props.indicatorRadius * 2 + "px";

      processElement.value.style.width = indicator.value.style.left =
        bar.value.getClientRects()[0].width * props.process + "px";

      let barRect = bar.value.getClientRects()[0];

      const setLeftAndWidth = (left) => {
        indicator.value.style.left = left + "px";
        processElement.value.style.width = left + "px";
        // context.emit( "update:process", parseFloat((left / barRect.width).toFixed(3)));
      };
      watchEffect(() => {
        setLeftAndWidth(barRect.width * props.process);
      });
      indicator.value.addEventListener("mousedown", () => (active = true));
      const moveHandler = (x) => {
        let left = x - barRect.left;
        left < 0 && (left = 0);
        left > barRect.width && (left = barRect.width);
        setLeftAndWidth(left);
      };
      document.addEventListener("mousemove", (e) => {
        if (!active) return;
        console.log(e);
        moveHandler(e.clientX);
      });
      indicator.value.addEventListener("touchmove", (e) =>
        moveHandler(e.touches[0].clientX)
      );

      document.addEventListener("mouseup", (e) => (active = false));
      bar.value.addEventListener("click", (e) => {
        console.log(e);
        setLeftAndWidth(e.clientX - barRect.left);
      });
    });
    return { bar, indicator, processElement };
  },
};
</script>
<style lang="scss" scoped>
.seekbar {
  background: red;
  height: 2px;
  width: 500px;
  position: relative;
  cursor: pointer;
  border-radius: 1px;
}
.indicator {
  cursor: pointer;
  position: absolute;
  width: 10px;
  height: 10px;
  background: black;
  border-radius: 50%;
  top: 50%;
  left: 0;
  transform: translate(-50%, -50%);
}
.process {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0;
  background: blue;
  border-radius: inherit;
}
</style>
