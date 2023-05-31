<template>
  <v-container grid-list-xs text-xs-center>

    <p><h2>DevOps Lead - Applicant Challenge</h2></p>
    <p></p>
    <v-responsive class="mx-auto" max-width="344">
        <p> <h4>Fetch the validation token from your email</h4></p>
        
      </v-responsive><p></p>
    <v-layout grow row wrap>
      <v-responsive class="mx-auto" max-width="344">
            <div v-if="error!=''"  style="color:red" >ID</div>
            <v-text-field
              v-model="token"
              text-xs-center
              label="Input Token from your email"
              required
              flat
              solo-inverted
            ></v-text-field>
            <v-btn       color="blue-grey"
      class="ma-2 white--text"
      @click="submit"
    >
      Validate Token and edit CV submission
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
  mounted(){
    console.log(this.$route.params.email)
    const email=this.$route.params.email ?? ""
    if (email ===""){
      this.$router.push("/validate_email")
      return
    }
    this.email=email
  },
  methods:{

    // submit(){
    //   let self = this;
    //   self.message = "";
    //   self.error = "";
    //   this.$axios
    //     .post("/validate_edit_cv", JSON.stringify({"email":self.email, "token":self.token}), {
    //     })
    //     .then(res => {
    //       self.$router.push({name:"edit_cv", params: {data:res.data}})
    //     })
    //     .catch(e => {
    //       this.$toast.success("There was an error serving your request")
    //     });
    // }
    submit() {
      let self = this;
      if (this.email === "" || this.token === "") {
        return;
      }
      this.$store
        .dispatch("user_profile/authenticateWithToken", {
          email:self.email,token:self.token
        })
        .then(() => {
          this.$router.push("/application_list");
        })
        .catch((e) => {
          console.log("le", e);
          if (e.data.includes("Invalid Credentials")) {
            self.error = "Invalid Credentials";
          } else {
            self.error = "An error occured";
          }
        });
    },
  }
}
</script>