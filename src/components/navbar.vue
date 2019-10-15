<template>
    <div class="navbar">
        <a href="#" @click="main">main</a>
        <a href="#" @click="test">testpage</a>
        <a href="#" @click="signout">Sign out</a>
    </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    name: "nav",
    methods:{
        async signout(){
            let res = await this.logoutAction()
            if (res.CODE === 200)
                this.$router.push("/login")
        },
        test() {
            this.$router.push(`/Taskinfo/${190004}`)        
        },
        main() {
            this.$router.push('/HelloWorld')       
        },                      
    ...mapActions(["logoutAction"])
    }
}
</script>

<style scoped>
.navbar{
    display: flex;
    justify-content:flex-end;
    align-items: center;
    background-color: rgb(19, 18, 18);
    height: 8vh;
}
.navbar a{
    text-decoration: none;
    margin-right: 5%;
    color: rgb(174, 179, 184);
    font-size: 26px;
}
.navbar a:hover{
    color: rgb(255, 255, 255);
}
</style>