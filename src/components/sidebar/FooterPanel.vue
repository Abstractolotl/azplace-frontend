<template>
    <div class="panel">
        <div class="lang">
            <a href="https://forms.gle/JuYuzkxUYMFYXwoY6">Feedback / Bug Report</a>
        </div>
        <!-- Todo: Implement languages
        <div class="lang">
            <span>Language: </span>
            <img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/313/flag-germany_1f1e9-1f1ea.png" />
            <img src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/313/flag-united-states_1f1fa-1f1f8.png" />
        </div>
        -->
        <div class="lang">
            <a href="#" @click="impressum">Impressum</a>
            <a href="#" @click="about">About us</a>
        </div>
        <span>
            Version {{ packagejson.version }}
        </span>
    </div>
</template>

<script lang="ts" setup>
import packagejson from '@/../package.json'

function about() {
    document.dispatchEvent(new CustomEvent("navigate", {detail: {page: "aboutus", width: 400}}))
}

function impressum() {
    document.dispatchEvent(new CustomEvent("navigate", {detail: {page: "impressum", width: 250}}))
}

</script>

<style lang="scss" scoped>
.panel {
    margin-top: auto;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-bottom: 10px;
    opacity: 0.5;

    a {
        color: lightcyan;
    }

    > span {
        font-size: 0.6rem;
        opacity: 0.75;
    }

}

.lang {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;

    > img {
        height: 20px;
    }
}
</style>

