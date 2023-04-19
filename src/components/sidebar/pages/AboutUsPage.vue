<template>
    <div class="aboutus">
        Meet the group of talented Apprentices that worked hard to bring this Project to life <br />
        If you want to know more about the creation process, don't be afraid to get in contact with us

        <div>
            <a href="https://github.com/Arekkus"><img src="https://avatars.githubusercontent.com/u/74536331"/></a>
            <a href="https://github.com/jonasrdl"><img src="https://avatars.githubusercontent.com/u/76961402"/></a>
            <a href="https://github.com/jonas-be"><img src="https://avatars.githubusercontent.com/u/90411737"/></a>
            <a href="https://github.com/Drumna"><img src="https://avatars.githubusercontent.com/u/47066135"/></a>
            <a href="https://github.com/NouCake"><img src="https://avatars.githubusercontent.com/u/25909346"/></a>
            <a href="https://github.com/lucasl0st"><img src="https://avatars.githubusercontent.com/u/17984007"/></a>
            <a href="https://github.com/Ancocodet"><img src="https://avatars.githubusercontent.com/u/90411737"/></a>
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