<script setup lang="ts">
import LiveCanvas from "@/components/LiveCanvas.vue";
import ColorSelectionBar from '@/components/ColorSelectionBar.vue';
import UserProfile from '@/components/UserProfile.vue';
</script>

<template>
  <main>
    <UserProfile />
    <LiveCanvas />
    <ColorSelectionBar />
  </main>
</template>
