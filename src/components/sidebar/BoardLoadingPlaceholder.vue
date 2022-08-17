<template>
    <div class="loading">
        <span>Loading Board</span>
        <div class="loader"></div>
    </div>
</template>

<style lang="scss">
.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    color: white;

    $width: 250px;
    $height: 150px;
    position: absolute;
    left: calc(50% - $width * 0.5);
    top: calc(50% - $height * 0.5);
    width: $width;
    height: $height;

    border-radius: 3px;
    background-color: rgba(0, 0, 0, 0.3);

    .loader {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
}
</style>