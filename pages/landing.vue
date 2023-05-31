<template>
  <v-container grid-list-xs text-xs-center>
    <p> <h2>DevOps Lead - Applicant Challenge</h2></p>
        <p> <h3>As presented by: Gilbert Ofoe Apronti</h3></p>
        <p class="mb-6"></p>
    <v-layout grow row wrap>
     
      <v-flex xs6   >
        <span class="mt-10">
            <v-row >

              <v-btn 
            color="blue-grey"
            class="ma-2 white--text align-self-items mt-6"
            @click="edit"
          >
            Login as Applicant
            <v-icon
              right
              dark
            >
              mdi-cloud-upload
            </v-icon>
          </v-btn>
          <p>
           
          </p>
          As an applicant, you will receive a token in your inbox
          <p>The token will be used to validation to edit the data</p>
          
          </v-row>
        </span>
        </v-flex>
        <v-flex xs2>
        
      </v-flex>
      <v-flex xs4>
        <v-row class="align-center">
              <v-btn 
            color="blue-grey"
            class="ma-2 white--text "
            @click="login_page"
          >
            Login as Portal Administrator
            <v-icon
              right
              light
            >
              mdi-cloud-upload
            </v-icon>
          </v-btn>
          <p></p>
          The portal admin will use the already has a password to authenticate
          </v-row>
        
        
      </v-flex>
   
    </v-layout>
  </v-container>
  
</template>
<script>
import XLSX from "xlsx";
import 'vuetify/dist/vuetify.css'
export default {
  layout: "unauth",
  middleware: [],
  data() {
    return {
      isNew:false,
      isEdit:false,
      isAdmin:false,
      id:0,
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
      
      console.log("submit")
      let self = this;
      self.error=""
      if (self.id==0 || self.full_name=="" || self.email=="" || self.phone_number=="" || self.file=="") {
        self.error="Complete all the fields to proceed"
        return
      }
      let formData = new FormData();
      formData.append('id', self.id);
      formData.append('cv_file', self.file);
      formData.append("name",self.full_name)
      formData.append("email",self.email)
      formData.append("phone",self.phone_number)
          this.$axios
            .post("/uploadcv",formData, {headers: { "Content-Type": "multipart/form-data" } }
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
