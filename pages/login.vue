<template>
  <div id="app">
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Login form</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <v-btn
                    icon
                    large
                    target="_blank"
                    slot="activator"
                  >
                    <v-icon large>security</v-icon>
                  </v-btn>
                </v-tooltip>
              </v-toolbar>
              <v-card-text>
                <v-form >
                  <v-text-field prepend-icon="person" name="login" label="User ID" type="text" v-model="user.user_id"  @keyup.enter="submit"></v-text-field>
                  <v-text-field prepend-icon="lock" name="password" label="Password" type="password"  v-model="user.password"  @keyup.enter="submit"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="submit" color="primary">Login</v-btn>
              </v-card-actions>
            </v-card>

            <v-alert v-if="error!=''"
                :value="true"
                type="error"
                :dismissible=true
              >
                {{error}}
              </v-alert>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</div>
</template>

<script>
export default {
  layout: 'unauth',
  data(){
    return {
      user:{
        user_id: '',
        password: ''
      },
      error:''
    }
  },
  methods:{
    submit(){
      let self = this
      if (this.user.user_id ==="" || this.user.password ==="") {
        return
      }
      this.$store.dispatch("user_profile/authenticateUser",{
        ...this.user
      }).then(() => {
        this.$router.push('/')
      }).catch(e => {
        console.log('le', e)
        if (e.data.includes('Invalid Credentials')){
          self.error= 'Invalid Credentials'
        } else {
          self.error='An error occured'
        }
        
      })
    }
  }
}
</script>

