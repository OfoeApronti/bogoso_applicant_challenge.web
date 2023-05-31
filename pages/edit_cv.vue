<template>
  <v-container grid-list-xs text-xs-center>
    
    <v-layout grow row wrap>
      
        
      <v-flex xs12>
        <v-form v-on:submit.prevent>
          <h3>Edit application data</h3>
          <v-responsive class="mx-auto" max-width="344">
            <div >The ID field cannot be edited <v-label>{{id}}</v-label></div>
            
           
          </v-responsive>
          <p></p>
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
          <v-responsive class="mx-auto" max-width="344">
            
    <a :href="download_file_path" :download="cv_file_name">Download {{ cv_file_name }}</a>
          </v-responsive>
      <p></p>
      <v-divider >
        </v-divider>
        <div class="mt-4">
          <p>You may upload a new file, however this is optional. </p>
          <input type="file"
       id="avatar" name="avatar"
       accept=".doc,.docx,.pdf,.odt"  v-on:change="selectedFile($event)">
       <div >Accepted format:.doc,.docx,.pdf,.odt</div>

       <v-btn
      color="blue-grey"
      class="ma-2 white--text"
      @click="submit"
    >
      Update application data
      <v-icon
        right
        dark
      >
        mdi-cloud-upload
      </v-icon>
    </v-btn>
    <v-divider >
        </v-divider>
    <v-btn
      color="#D50000"
      class="mt-4 ma-2 white--text"
      @click="delete_application"
    >
      Delete my application
      <v-icon
        right
        dark
        
      >
        mdi-cloud-upload
      </v-icon>
    </v-btn>
  </div>
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
      email: [],
      phone_number: "",
      cv_file_name:"",
      download_file_path: "",
      message: "we have a lot of bas",
      error: "",
      file: ""
    };
  },
  mounted(){
    console.log(this.$route.params.id)
    const data=this.$route.params.id ?? ""
    let self=this
    if (data ===""){
      this.$toast.error("There was an error fetching the requested info.")
      this.$router.push("/application_list")
      return
    }
    this.$axios
        .post("/get_single_item", JSON.stringify({"id":data}), {
        })
        .then(res => {
          self.$toast.success("Fetched successful")
          self.email=res.data.email
          self.id=res.data.id
          self.full_name=res.data.applicant_name
          self.phone_number=res.data.phone
          self.cv_file_name=res.data.file_name
          self.download_file_path="/public/"+res.data.file_name
        })
        .catch(e => {
          this.$toast.success("There was an error serving your request")
        });

    
  },
  methods: {
    login_page(){
      this.$router.push("/login")
    },
    selectedFile(event) {
      this.file = event.target.files[0]
    }, 
    new_application(){
      this.$router.push("/uploadcv")
    },
    delete_application(){
      let self = this;
      self.message = "";
      self.error = "";
      if (self.id==""){
        this.$toast.error("The ID is invalid")
        return
      }
      const token = self.$store.state.user_profile.token;
      console.log(token);
      if (token === null) {
        this.$router.push("/landing");
        return;
      }
      this.$axios
        .post("/delete_application", JSON.stringify({"id":self.id}), {headers: { Authorization: `Bearer ${token}`}
        })
        .then(res => {
          this.$toast.success("Delete successful")
          self.$router.push("/application_list")
        })
        .catch(e => {
          this.$toast.success("There was an error serving your request")
        });
    },
    submit() {
      
      console.log("submit")
      let self = this;
      if (self.id==0 || self.full_name=="" || self.email=="" || self.phone_number=="") {
        self.error="Complete all the fields to proceed"
        self.$toast.error("Complete all the fields before submitting")
        return
      }
      let formData = new FormData();
      formData.append('id', self.id);
      if (self.file!=""){
        formData.append('cv_file', self.file);
      }
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
            .post("/update_cv_application",formData, {headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
            )
            .then((res) => {
              self.$toast.success("Application updated.")
              self.$router.push("/application_list")
            })
            .catch((e) => {
              this.$toast.error("There was an error processing your request")
            });
      
    },
    download(){

    },
    loadForm(data){
      let self=this
      self.id=data.id
      self.full_name=data.applicant_name
      self.email=data.email
      self.phone_number=data.phone 
      self.cv_file_name=data.file_name
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
