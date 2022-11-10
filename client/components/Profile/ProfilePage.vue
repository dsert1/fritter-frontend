<!-- Default page that also displays freets -->

<template>
    <main>
      <section v-if="$store.state.username">
        <header>
          <h2>Welcome @{{ $store.state.username }}</h2>
        </header>
        <h3>Streak: {{ Math.ceil(Math.abs(new Date().getTime() - new Date($store.state?.freets[0]?.dateModified.substring(0, 10) + $store.state?.freets[0]?.dateModified.substring(12, 17)).getTime()) / (1000 * 3600 * 24)) }} 🔥</h3>
        
        <h3>Followers: {{ this.followersCount }}</h3>
        <h3>Following: {{ this.followingCount }}</h3>
        <CreateFreetForm />
      </section>
      <section v-if="$store.state.username">
        <header>
          <div class="left">
            <h2>
              Viewing your freets
              <span v-if="$store.state.filter">
                by @{{ $store.state.filter }}
              </span>
            </h2>
          </div>
          <div class="right">
            <GetFreetsForm
              ref="getFreetsForm"
              value="author"
              placeholder="🔍 Filter by author (optional)"
              button="🔄 Get freets"
              class="searchBox"
            />
          </div>
        </header>
        <section
          v-if="$store.state.freets.length"
        >
        <!-- <vue-scrollbox mode="vertical" @scroll="onScroll" @resize="onResize"> -->
        <div class="scrollbox">
          <FreetComponent
            v-for="freet in $store.state.freets.filter(f => f.author == $store.state.username)"
            :key="freet.id"
            :freet="freet"
            class="freet"
          />
        </div>
        <!-- </vue-scrollbox> -->
        </section>
        <article
          v-else
        >
          <h3>No freets found.</h3>
        </article>
      </section>
      <section v-else>
        <p>You are not logged in!</p>
      </section>
    </main>
  </template>
  
  <script>
  
  import FreetComponent from '@/components/Freet/FreetComponent.vue';
  import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
  import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';
  
  // Vue.component('vue-scrollbox', VueScrollbox);
  export default {
    name: 'FreetPage',
    components: {FreetComponent, GetFreetsForm, CreateFreetForm},
    mounted() {
      this.$refs.getFreetsForm.submit();
      this.count();
    },
    data() {
      return {
        followingCount : 0,
        followersCount : 0
      }
    },
    getters: {
      getDate() {
        return new Date() - new Date($store.state?.freets[0]?.dateModified);
      }
    },
    methods: {
      async count() {
        try {
          const r = await fetch('/api/users/getAllUsers');
          const response = await r.json();
          if (!r.ok) {
              throw new Error(response.error);
          }
          this.user = response.users.filter(u => this.$store.state.username == u.username)[0];
          this.followingCount = this.user.following.length;
          this.followersCount = this.user.followers.length;

        } catch (e) {
            this.$set(this.alerts, e, "error");
            setTime(() => this.$delete(this.alerts, e), 3000);
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
  