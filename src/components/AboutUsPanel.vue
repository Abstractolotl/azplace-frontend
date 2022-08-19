<template>
    <div class="aboutus">
        Meet the group of talented Apprenices that worked hard to bring ths Project to life <br />
        If you want to know more about the creation process don't be afraid to get in contact with us 
        
        <div>
            <a href="https://united-internet.org/profiles/people/21550081"><img src="https://api.azubi.server.lan/image/personalpicture/21550081"/></a>
            <a href="https://united-internet.org/profiles/people/21549706"><img src="https://api.azubi.server.lan/image/personalpicture/21549706"/></a>
            <a href="https://united-internet.org/profiles/people/21566957"><img src="https://api.azubi.server.lan/image/personalpicture/21566957"/></a>
            <a href="https://united-internet.org/profiles/people/21549699"><img src="https://api.azubi.server.lan/image/personalpicture/21549699"/></a>
            <a href="https://united-internet.org/profiles/people/21549701"><img src="https://api.azubi.server.lan/image/personalpicture/21549701"/></a>
            <a href="https://united-internet.org/profiles/people/21549705"><img src="https://api.azubi.server.lan/image/personalpicture/21549705"/></a>
            <a href="https://united-internet.org/profiles/people/21549708"><img src="https://api.azubi.server.lan/image/personalpicture/21549708"/></a>
            <a href="https://united-internet.org/profiles/people/21549700"><img src="https://api.azubi.server.lan/image/personalpicture/21549700"/></a>
        </div>
    </div>
</template>


<script lang="ts" setup>
</script>


<style lang="scss" scoped>

    .aboutus {
        padding: 10px;
        text-align: center;
        display: flex;
        justify-content: center;
        flex-direction: column;
        gap: 10px;

        > div {
            display: grid;
            grid-template-columns: auto auto auto;
        }

        img {
            width: 100px;
        }
    }

</style>