<template>
    <article
        class="follow"
    >
        <header>
            <h1>
                @{{ username }}
            </h1>
        </header>
        <section>
            <button
                v-if="following"
                @click="unfollow"  
            >
            Unfollow
            </button>
            <button
                v-else
                @click="follow"
            >
                Follow
            </button>
        </section>
    </article>
</template>
<script>
export default {
    name: "FollowComponent",
    props: {
        username: String,
        required: true
    },
    data() {
        return {
            following: false,
            user: ""
        };
    },
    mounted() {
        this.loadFollowing();
    },
    methods: {
        async loadFollowing() {
            try {
                const r = await fetch('/api/users/getAllUsers');
                const response = await r.json();
                if (!r.ok) {
                    throw new Error(response.error);
                }
                this.user = response.users.filter(u => this.$store.state.username == u.username)[0];
                this.following = this.user.following.includes(this.username);
            } catch (e) {
                this.$set(this.alerts, e, "error");
                setTime(() => this.$delete(this.alerts, e), 3000);
            }
        },
        async follow() {
        const options = {
            method: 'PUT',
            body: JSON.stringify({
              user1: this.$store.state.username,
              user2: this.username
            }),
            headers: { 'Content-Type': 'application/json' }
          };
        try {
              const r = await fetch('/api/users/addFollower', options);
              const response = await r.json();
              if (!r.ok) {
                  throw new Error(response.error);
              }
              console.log(response);
              this.following = true;
            } catch (e) {

            }
        
      },
        async unfollow() {
            const options = {
            method: 'PUT',
            body: JSON.stringify({
              user1: this.$store.state.username,
              user2: this.username
            }),
            headers: { 'Content-Type': 'application/json' }
          };
            try {
                const r = await fetch('/api/users/removeFollower', options);
                const response = await r.json();
                if (!r.ok) {
                    throw new Error(response.error);
                }
                this.following = false;
            } catch (e) {
                this.$set(this.alerts, e, "error");
                setTime(() => this.$delete(this.alerts, e), 3000);
            }
        },
        async getUser() {
            try {
                const r = await fetch('/api/users/getAllUsers');
                const response = await r.json();
                if (!r.ok) {
                    throw new Error(response.error);
                }
                this.user = response.users.filter(u => this.$store.state.username == u.username)[0];
            } catch (e) {
                this.$set(this.alerts, e, "error");
                setTime(() => this.$delete(this.alerts, e), 3000);
            }
        }
    }
}
</script>