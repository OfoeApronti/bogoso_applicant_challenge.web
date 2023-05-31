<template>
  <v-container grid-list-xs text-xs-center>
    <v-layout grow row wrap>
      <v-flex xs12>
        <v-form v-on:submit.prevent>
          <p><h3>Upload your CV</h3></p>
          <v-responsive class="mx-auto" max-width="344">
            <div v-if="error!=''"  style="color:red" >ID should not be zero(0)</div>
            <v-text-field
              v-model="id"
              text-xs-center
              label="ID"
              required
              flat
              solo-inverted
            ></v-text-field>
           
          </v-responsive>
          <v-responsive class="mx-auto" max-width="344">
            <div v-if="error!=''"  style="color:red" >The full name is required</div>
            <v-text-field
              v-model="full_name"
              text-xs-center
              label="Full Name"
              required
              flat
              solo-inverted
            ></v-text-field>
           
          </v-responsive>
          <v-responsive class="mx-auto" max-width="344">
            <div v-if="error!=''" style="color:red">The email is required</div>
            <v-text-field
              v-model="email"
              text-xs-center
              label="Your email"
              required
              type="email"
              flat
              solo-inverted
            ></v-text-field>
          </v-responsive>
          <v-responsive class="mx-auto" max-width="344">
            <div v-if="error!=''" style="color:red">The email is required</div>
            <v-text-field
              v-model="phone_number"
              text-xs-center
              label="Phone number"
              required
              type="phone_number"
              flat
              solo-inverted
            ></v-text-field>
          </v-responsive>
          <input type="file"
       id="avatar" name="avatar"
       accept=".doc,.docx,.pdf,.odt" v-on:change="selectedFile($event)">
       <v-btn
      color="blue-grey"
      class="ma-2 white--text"
      @click="submit"
    >
      Upload
      <v-icon
        right
        dark
      >
        mdi-cloud-upload
      </v-icon>
    </v-btn>
    <div >Accepted format:.doc,.docx,.pdf,.odt</div>
    <div v-if="error!=''" style="color:red">Upload file required</div>
          <!-- <v-btn @click="submit">submit</v-btn> -->
        </v-form>
        
        
      </v-flex>
    </v-layout>
  </v-container>
  
</template>
<script>
import XLSX from "xlsx";
import 'vuetify/dist/vuetify.css'
export default {
  layout: "auth",
  middleware: ["check-auth", "auth"],
  data() {
    return {
      isNew:false,
      isEdit:false,
      isAdmin:false,
      id:"",
      full_name: "",
      email: "",
      phone_number: "",
      message: "",
      error: "",
      file: ""
    };
  },
  mounted(){
  },
  methods: {
    selectedFile(event) {
      this.file = event.target.files[0]
    },
    edit(){
      this.$router.push("/validate_email")
    },
    login_page(){
      this.$router.push("/login")
    },
    submit() {
      
      
      let self = this;
      self.error=""
      if (self.id=="" || self.full_name=="" || self.email=="" || self.phone_number=="" || self.file=="") {
        self.error="Complete all the fields to proceed"
        return
      }
      let formData = new FormData();
      formData.append('id', self.id);
      formData.append('cv_file', self.file);
      formData.append("name",self.full_name)
      formData.append("email",self.email)
      formData.append("phone",self.phone_number)
      const token = self.$store.state.user_profile.token;
      console.log(token);
      if (token === null) {
        this.$router.push("/landing");
        return;
      }
          this.$axios
            .post("/uploadcv",formData, {headers: {Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
            )
            .then((res) => {
              self.resetForm()
              self.$toast.success("Your application has been submitted successfully")
            })
            .catch((e) => {
              self.$toast.error("Sorry, there was an error submitting your application")
            });
      
    },
    resetForm(){
      let self=this
      self.id=0
      self.full_name="" 
      self.email=""
      self.phone_number="" 
      self.file=""
    },  

    onexport() {
      // On Click Excel download button
      this.message = "";
      this.error = "";
      if (this.items.length < 1) {
        this.error = "No customer records to download";
        return;
      }
      // export json to Worksheet of Excel
      // only array possible
      var accWS = XLSX.utils.json_to_sheet(this.items);

      // A workbook is the name given to an Excel file
      var wb = XLSX.utils.book_new(); // make Workbook of Excel

      // Workbook contains one or more worksheets
      XLSX.utils.book_append_sheet(wb, accWS, "customers"); // sheetAName is name of Worksheet

      // export Excel file
      XLSX.writeFile(wb, "customers.xlsx"); // name of the file is 'book.xlsx'
    },
  },
};
</script>
