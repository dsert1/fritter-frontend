<!-- Default page that also displays freets -->

<template>
    <main>
      <section v-if="$store.state.username">
        <header>
          <h2>Welcome @{{ $store.state.username }}</h2>
        </header>
        <h1>See the list below to follow:</h1>
        <section v-if="users.length">
            <FollowComponent 
              v-for="user in users"
              :key="user.id"
              :username="user.username"
              @reload="getUsers"
            />
        </section>

      </section>
      <!-- <h1>{{ users }}</h1> -->
    </main>
  </template>
  
  <script>
  
  import FreetComponent from '@/components/Freet/FreetComponent.vue';
  import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
  import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';
  import FollowComponent from '@/components/Recommended_Followers/Follow.vue';
  
  // Vue.component('vue-scrollbox', VueScrollbox);
  export default {
    name: 'RecFollowers',
    components: {FreetComponent, GetFreetsForm, CreateFreetForm, FollowComponent},
    mounted() {
    //   this.$refs.getFreetsForm.submit();
      this.getUsers();
    },
    data() {
        return {
            users: []
        }
    },
    getters: {
      getDate() {
        return new Date() - new Date($store.state?.freets[0]?.dateModified);
      }
    },
    methods: {
        async getUsers() {
            try {
                const r = await fetch('/api/users/getAllUsers');
                const response = await r.json();
                if (!r.ok) {
                    throw new Error(response.error);
                }
                this.users = response.users;
                this.$forceReload();
            } catch (e) {

            }
        }
    }
  };
  </script>
  
  <style scoped>
  section {
    display: flex;
    flex-direction: column;
  }

  .searchBox {
    position: relative;
    border: 2px solid #cdcdcd;
    border-color: rgba(0, 0, 0, .14);
    background-color: AliceBlue;
    font-size: 14px;
  }
  
  header, header > * {
      display: flex;
      justify-content: space-between;
      align-items: center;
  }
  
  button {
      margin-right: 10px;
  }
  
  section .scrollbox {
    flex: 1 0 50vh;
    padding: 3%;
    overflow-y: scroll;
    scrollbar-width: thin;          /* "auto" or "thin" */
    scrollbar-color: blue;
  }
  
  .freet {
    margin-bottom: 10%;
    background-color: #F1F1F1;
  }
  </style>
  