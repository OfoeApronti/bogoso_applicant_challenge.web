<template>
  <v-app>
    <v-navigation-drawer
      fixed
      :clipped="$vuetify.breakpoint.mdAndUp"
      app
      v-model="drawer"
      :width="200"
    >
      <v-list dense>
        <v-list-tile
          v-for="item in sample_items"
          :key="item.title"
          :to="item.route"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      dark
      app
      :clipped-left="$vuetify.breakpoint.mdAndUp"
      fixed
    >
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon
          @click.stop="drawer = !drawer"
        ></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">Applicant Challenge</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <span> {{ user_name }} </span>

      <v-btn @click="signOut"> Logout </v-btn>
      <v-btn icon>
        <v-icon>notifications</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  middleware: "auth",
  data() {
    return {
      dialog: false,
      drawer: null,
      fixed: true,
      sample_items: [
      {
          icon: "account_balance",
          title: "Applicants",
          action: "battery_alert",
          route: "/application_list"
        },
        {
          icon: "perm_contact_calendar",
          title: "Add New",
          action: "storage",
          active: false,
          route: "/uploadcv"
        },
      ],
    };
  },
  computed: {
    user_name: function () {
      return this.$store.getters["user_profile/getUserName"];
    },
  },

  methods: {
    signOut() {
      console.log("signOut");
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
  },
};
</script>
