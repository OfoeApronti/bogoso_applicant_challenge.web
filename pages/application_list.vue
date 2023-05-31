<template>
  <v-container grid-list-md text-xs-center>
    <v-layout grow row wrap>
      <v-flex xs12>
        <v-form v-on:submit.prevent>
          <v-text-field
            v-model="search_id"
            text-xs-center
            label="Search, Input an ID and hit Enter"
            required
            @keyup.enter="search_by_id"
            flat
            solo-inverted
            class="hidden-sm-and-down"
          ></v-text-field>
          <!-- <v-btn @click="submit">submit</v-btn> -->
        </v-form>
      </v-flex>
      <v-flex xs12>
        <v-toolbar flat color="white">
          <v-toolbar-title>Applicant Challenge Submission</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark v-on:click="create_new"
            >Create New Record</v-btn
          >
          <v-btn color="primary" dark v-on:click="onexport"
            >Download Data</v-btn
          >
        </v-toolbar>
        <v-data-table :headers="headers" :items="items" class="elevation-1">
          <template v-slot:items="props">
            <td class="text-xs-left">{{ props.item.id }}</td>
            <td class="text-xs-left">{{ props.item.applicant_name }}</td>
            <td class="text-xs-left">{{ props.item.email }}</td>
            <td class="text-xs-left">{{ props.item.phone }}</td>
            <td class="text-xs-left">
              <a
                :href="'/public/' + props.item.file_name"
                :download="props.item.file_name"
                >Download</a
              >
            </td>
            <td class="text-xs-left"><v-btn color="primary" dark v-on:click="edit_item(props.item.id)"
            >Edit</v-btn
          ></td>
          <td class="text-xs-left"><v-btn color="secondary" dark v-on:click="delete_item(props.item.id)"
            >Delete</v-btn
          ></td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import XLSX from "xlsx";
export default {
  middleware: ["check-auth", "auth"],
  data() {
    return {
      search_id: "",
      payload: [],
      error: "",
      message: "",
      headers: [
        { text: "ID", value: "id" },
        { text: "Name", value: "applicant_name" },
        { text: "Email", value: "email" },
        { text: "Phone", value: "phone" },
        { text: "CV", value: "cv_file" },
      ],
      items: [],
    };
  },
  mounted() {
    this.load_list()
  },
  methods: {
    load_list(){
      let self = this;
    const token = self.$store.state.user_profile.token;
    if (token === null) {
      this.$router.push("/landing");
      return;
    }
    this.$axios
      .get("/get_applicants_list", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        self.items = res.data;
      })
      .catch((e) => {
        self.error = e.data;
      });
    },  
    search_by_id(){
      let self=this
      const token = self.$store.state.user_profile.token;
      console.log(token)
    if (token === null) {
      this.$router.push("/landing");
      return;
    }
      this.$axios
      .post("/search_by_id", {id:self.search_id},{
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {

        self.items = res.data;
      })
      .catch((e) => {
        self.error = e.data;
      });

    },
    delete_item(id){
      let self=this
      const token = self.$store.state.user_profile.token;
    if (token === null) {
      this.$router.push("/landing");
      return;
    }
      this.$axios
        .post("/delete_application", {id},{
        headers: { Authorization: `Bearer ${token}` },
      
        })
        .then(res => {
          this.$toast.success("Delete successful")
          self.load_list()
        })
        .catch(e => {
          this.$toast.success("There was an error serving your request")
        });
    },
    create_new(){
      this.$router.push("/uploadcv")
    }, 
    edit_item(id){
      console.log(id)
      this.$router.push({name:"edit_cv", params: {id}})
    } , 
    submit() {
      let self = this;
      self.message = "";
      self.error = "";
      if (self.accs !== "") {
        let casas = this.sanitizeText(self.accs);
        let strLen = casas.length;
        if (strLen !== 0 || strLen < 401) {
          const token = self.$store.state.user_profile.token;
          if (token === null) {
            return;
          }
          this.$axios
            .post("/cust", JSON.stringify(casas), {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
              console.log("here1", res.data);

              self.items = res.data;
              console.log("self.items", self.items);
            })
            .catch((e) => {
              self.error = e.data;
            });
        } else {
          self.error = "Search is limit to 1 to 400 at a time";
        }
      }
    },
    sanitizeText(str) {
      //remove carriage return etc
      let a1 = str.replace(/[\n\r]/g, ",");
      //replace repeated spaces
      let a2 = a1.replace(/\s\s+/g, ",");
      let a3 = a2.replace(/ /g, ",");
      //replace all special characters
      let a4 = a3.replace(/[`~!@#$%^&*()_|+\-=?;:'".<>\{\}\[\]\\\/]/gi, ",");
      //split and return the string
      console.log("a3", a3);
      let a5 = a4.split(",");
      let arrayItems = [];
      a5.map(function (i, k) {
        //return {"accNumber":i}
        arrayItems.push(i);
      });
      return arrayItems;
    },
    onexport() {
      // On Click Excel download button
      this.message = "";
      this.error = "";
      if (this.items.length < 1) {
        this.error = "No applicant records to download";
        return;
      }
      // export json to Worksheet of Excel
      // only array possible
      var accWS = XLSX.utils.json_to_sheet(this.items);

      // A workbook is the name given to an Excel file
      var wb = XLSX.utils.book_new(); // make Workbook of Excel

      // Workbook contains one or more worksheets
      XLSX.utils.book_append_sheet(wb, accWS, "applicants"); // sheetAName is name of Worksheet

      // export Excel file
      XLSX.writeFile(wb, "applicants.xlsx"); // name of the file is 'book.xlsx'
    },
  },
};
</script>
