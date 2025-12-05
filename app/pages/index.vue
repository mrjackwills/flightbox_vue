<template>
	<Authed v-if='authenticated' />
	<Login v-else />
</template>

<script setup lang="ts">

const authenticated = computed(() => userModule().authenticated)

</script>
