<template>
	<v-app id='app_back' class='ma-0 pa-0' :class='firefox'>
		<AppToolbar />
		<AppDialog />
		<AppSnackbar />
		<v-main class='ma-0 pa-0 mb-12'>
			<v-container class='fill-height d-flex align-center flex-wrap' fluid>
				<NuxtPage />
			</v-container>
		</v-main>
		<AppFooter class='py-4' />
	</v-app>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { FIREFOX_CSS_NAME } from '@/types'
import { env } from '@/utils/env'
import { headerLinks, json_ld, openGraphHeaders, themeColor, twitterHeaders } from '~/utils/header'
const { $pwa } = useNuxtApp()

const route = useRoute()
const browserStore = browserModule()

const title = computed(() => browserStore.title)

const description = computed(() => browserStore.description)

/// Check if running as PWA
function isPwa () {
	const isStandalone = window.matchMedia('(display-mode: standalone)').matches
	const isIOSStandalone = 'standalone' in window.navigator && window.navigator.standalone
	const isTWA = document.referrer.startsWith('android-app://')
	return isStandalone || isIOSStandalone || isTWA
}

function setVhUnit () {
	document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px')
}

/// Probably overkill
function remove_firefox_css () {
	include_firefox_css.value = false
	const styleTags = document.head.querySelectorAll('style')

	for (const tag of styleTags) {
		if (tag.innerHTML.includes(FIREFOX_CSS_NAME)) {
			tag.remove()
		}
	}
}

/// Install PWA
async function _pwa_install () {
	if ($pwa?.swActivated) {
		await $pwa.install()
	}
}

const include_firefox_css = ref(true)
const firefox = computed(() => {
	return include_firefox_css.value ? FIREFOX_CSS_NAME : ''
})

onMounted((): void => {
	if (isPwa()) {
		setVhUnit()
		window.addEventListener('resize', setVhUnit)
	}
	remove_firefox_css()
})

const prefix = 'flightbox'

useHead({
	title: () => {
		return title.value ? `${prefix} - ${title.value}` : prefix
	},

	meta: [
		{
			name: `description`,
			content: (): string => {
				return description.value ? `${prefix} - ${description.value}` : `${prefix}`
			},
		},
		themeColor,
		...openGraphHeaders,
		...twitterHeaders,
	],
	link: () => [
		{
			rel: 'canonical',
			href: `${env.domain}${route?.path}`,
		},
		...headerLinks,
		{
			rel: 'preload',
			type: 'font/woff2',
			href: '/fonts/baloo-2-v23-latin-regular.woff2',
			as: 'font',
			crossorigin: '',
		},
	],

	script: [
		json_ld,

	],
})

</script>
