<template>
  <v-container grid-list-xs text-xs-center>
    <p> <h2>DevOps Lead - Applicant Challenge</h2></p>
        <p> <h3>As presented by: Gilbert Ofoe Apronti</h3></p>
        <p></p>
    <v-layout grow row wrap></v-layout>
    <v-layout grow row wrap></v-layout>
    <v-layout grow row wrap>
      <v-flex xs4  >
            <v-row>
              <v-btn 
            color="blue-grey"
            class="ma-2 white--text align-self-items"
            @click="edit"
          >
            Edit a previous CV submission
            <v-icon
              right
              dark
            >
              mdi-cloud-upload
            </v-icon>
          </v-btn>
        
          
          </v-row>
          <v-row class="align-center">
              <v-btn 
            color="blue-grey"
            class="ma-2 white--text "
            @click="submit"
          >
            Login as Portal Administrator
            <v-icon
              right
              light
            >
              mdi-cloud-upload
            </v-icon>
          </v-btn>

          </v-row>
        </v-flex>
        <v-flex xs2>
          <v-divider
          vertical
          >
        </v-divider>
      </v-flex>
      <v-flex xs6>
        <v-form v-on:submit.prevent>
          <p><h3>Upload your CV</h3></p>
          <v-responsive class="mx-auto" max-width="344">
            <div v-if="error!=''"  style="color:red" >ID</div>
            <v-text-field
              v-model="id"
              text-xs-center
              label="ID"
              required
              flat
              solo-inverted
              type="number"
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
       accept="image/png, image/jpeg" v-on:change="selectedFile($event)">
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
  layout: "unauth",
  middleware: [],
  data() {
    return {
      isNew:false,
      isEdit:false,
      isAdmin:false,
      id:"",
      full_name: "",
      email: [],
      phone_number: "",
      message: "we have a lot of bas",
      error: "",
      file: ""
    };
  },
  mounted(){
    console.log("mounted")
    this.$toast("My toast content", {
    timeout: 2000
});
  },
  methods: {
    selectedFile(event) {
      this.file = event.target.files[0]
    }, 
    submit() {
      
      console.log("submit")
      let self = this;
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
      
          // const token = self.$store.state.user_profile.token;
          // if (token === null) {
          //   self.error="You need to be logged in"
          //   return;
          // }
          // this.$axios
          //   .post("/uploadcv", JSON.stringify(casas), {
          //     headers: { Authorization: `Bearer ${token}` },
          //   })
          //   .then((res) => {
          //     console.log("here1", res.data);

          //     self.items = res.data;
          //     console.log("self.items", self.items);
          //   })
          //   .catch((e) => {
          //     self.error = e.data;
          //   });
          
          this.$axios
            .post("/uploadcv",formData, {headers: { "Content-Type": "multipart/form-data" } }
            )
            .then((res) => {
              console.log("here1", res.data);

              self.items = res.data;
              console.log("self.items", self.items);
            })
            .catch((e) => {
              self.error = e.data;
            });
      
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
