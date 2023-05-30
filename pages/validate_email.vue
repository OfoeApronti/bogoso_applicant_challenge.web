<template>
  <v-container grid-list-xs text-xs-center>

    <p><h2>DevOps Lead - Applicant Challenge</h2></p>
    <p></p>
    <v-responsive class="mx-auto" max-width="344">
        <p> <h4>Enter the email address you registered with, you will receive a token in your mail to update your records</h4></p>
        
      </v-responsive><p></p>
    <v-layout grow row wrap>
      <v-responsive class="mx-auto" max-width="344">
            <div v-if="error!=''"  style="color:red" >ID</div>
            <v-text-field
              v-model="email"
              text-xs-center
              label="Input Email of submitted CV"
              required
              flat
              solo-inverted
            ></v-text-field>
            <v-btn       color="blue-grey"
      class="ma-2 white--text"
      @click="submit"
    >
      Submit Email
      <v-icon
        right
        dark
      >
        mdi-cloud-upload
      </v-icon>
    </v-btn>
           
          

            
           
  </v-responsive>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  layout: "unauth",
  middleware: [],
  data() {
    return {
      email: "",
      token: "",
      email_submitted: "false",
      message: "",
      error: "",
      file: ""
    };
  },
  methods:{
    validate_email(val){
      let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if(val.match(mailformat))
      {
      console.log("Valid email address!");
      return true;
    } else {
      return false;
    }
    },
    submit(){
      let self = this;
      self.message = "";
      self.error = "";
      if (!this.validate_email(self.email)){
        this.$toast.error("The email is invalid")
        return
      }
      this.$axios
        .post("/send_email", JSON.stringify({"email":self.email}), {
        })
        .then(res => {
          this.$toast.success("Check your email for the verification token")
          self.$router.push({name:"validate_token", params: {email: self.email}})
        })
        .catch(e => {
          this.$toast.success("There was an error serving your request")
        });
    }
  }
}
</script>