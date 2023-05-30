<template>
  <v-container grid-list-md text-xs-center>
    <v-layout grow row wrap>
      <v-flex xs12>
        <v-form v-on:submit.prevent>
          <v-text-field
            v-model="accs"
            text-xs-center
            label="Enter/paste account number(s)"
            required
            @keyup.enter="submit"
            flat
            solo-inverted
            class="hidden-sm-and-down"
          ></v-text-field>
          <!-- <v-btn @click="submit">submit</v-btn> -->
        </v-form>
      </v-flex>
      <v-flex xs12>
        <v-toolbar flat color="white">
          <v-toolbar-title>Customer Records Status</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark v-on:click="onexport">Download Data</v-btn>
        </v-toolbar>
        <v-data-table :headers="headers" :items="items" class="elevation-1">
          <template v-slot:items="props">
            <td class="text-xs-left">{{ props.item.custNo }}</td>
            <td class="text-xs-left">{{ props.item.recStat }}</td>
            <td class="text-xs-left">{{ props.item.branch }}</td>
            <td class="text-xs-left">{{ props.item.noDr1 }}</td>
            <td class="text-xs-left">{{ props.item.noCr1 }}</td>
            <td class="text-xs-left">{{ props.item.dormant1 }}</td>
            <td class="text-xs-left">{{ props.item.postAllowed1 }}</td>
            <td class="text-xs-left">{{ props.item.authStat1 }}</td>
          </template>
        </v-data-table>
        <v-alert v-if="error!=''" :value="true" type="error">{{error}}</v-alert>
        <v-alert v-if="message!=''" :value="true" :dismissible="true" type="info">{{message}}</v-alert>
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
      accs: "",
      payload: [],
      error: "",
      message: "",
      headers: [
        {
          text: "CustNo",
          align: "left",
          sortable: true,
          value: "custNo"
        },
        { text: "RecStat", value: "recStat" },
        { text: "Branch", value: "branch" },
        { text: "NoDr1", value: "NoDr1" },
        { text: "NoCr1", value: "NoCr1" },
        { text: "Dormant1", value: "Dormant1" },
        { text: "PostAllowed1", value: "PostAllowed1" },
        { text: "AuthStat1", value: "AuthStat1" }
      ],
      items: []
      //items:[{"CustNo":"1090000468843","RecStat":"O","Branch":"001","NoDr1":"N","NoDr2":"N","NoCr1":"N","NoCr2":"N","Dormant1":"N","Dormant2":"N","PostAllowed1":"Y","PostAllowed2":"Y","AuthStat1":"A","AuthStat2":"A"}]
    };
  },
  methods: {
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
              headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
              console.log("here1", res.data);
              
              self.items = res.data;
              console.log("self.items", self.items);
            })
            .catch(e => {
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
      a5.map(function(i, k) {
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
    }
  }
};
</script>
