/* eslint-disable */
<template>
  <div id="invoice-POS">
    <center id="top">
      <div class="logo"></div>
      <div class="info">
        <h2>SBISTechs Inc</h2>
      </div>
      <!--End Info-->
    </center>
    <!--End InvoiceTop-->

    <div id="mid">
      <div class="info">
        <h2>Contact Info</h2>
        <p>
          Address : street city, state 0000 Email : JohnDoe@gmail.com Phone :
          555-555-5555
        </p>
      </div>
    </div>
    <!--End Invoice Mid-->

    <div id="bot">
      <div id="table">
        <table>
          <tr class="tabletitle">
            <td class="item"><h2>Item</h2></td>
            <td class="Hours"><h2>Qty</h2></td>
            <td class="Rate"><h2>Sub Total</h2></td>
          </tr>

          <tr v-for="(item, i) in orders" :key="i" class="service">
            <td class="tableitem">
              <p class="itemtext">{{ item.product_name }}</p>
            </td>
            <td class="tableitem">
              <p class="itemtext">{{ item.quantity }}</p>
            </td>
            <td class="tableitem">
              <p class="itemtext">{{ item.total }}</p>
            </td>
          </tr>
          <tr class="itemtextTotal service">
            <td class="">
              <strong><h4>TOTAL</h4></strong>
            </td>
            <td colspan="2" style="text-align: right;">
              <h4>{{ this.totalDue }}</h4>
            </td>
          </tr>
          <!-- <div class=" itemtextTotal">
            <strong>TOTAL</strong>
            {{ this.totalDue }}
          </div> -->
          <tr class="tabletitle">
            <td></td>
            <td class="Rate"><h2>VAT Sales</h2></td>
            <td class="payment">
              <h2>{{ this.VATSales }}</h2>
            </td>
          </tr>
          <tr class="tabletitle">
            <td></td>
            <td class="Rate"><h2>VAT Exempt</h2></td>
            <td class="payment">
              <h2>{{ this.VatExempt }}</h2>
            </td>
          </tr>
          <tr class="tabletitle">
            <td></td>
            <td class="Rate"><h2>VAT</h2></td>
            <td class="payment">
              <h2>{{ this.VAT }}</h2>
            </td>
          </tr>

          <tr class="tabletitle">
            <td></td>
            <td class="Rate"><h2>Total</h2></td>
            <td class="payment">
              <h2>{{ this.totalDue }}</h2>
            </td>
          </tr>
        </table>
      </div>
      <!--End Table-->

      <div id="legalcopy">
        <p class="legal">
          <strong>Thank you for your business!</strong> Payment is expected
          within 31 days; please process this invoice within that time. There
          will be a 5% interest charge per month on late invoices.
        </p>
      </div>
    </div>
    <!--End InvoiceBot-->
    <button @click="exportToPDF" class="btn btn-success">PDF</button>
  </div>
  <!--End Invoice-->
</template>

<script>
/* eslint-disable */
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";
export default {
  name: "invoice",
  data() {
    return {
      orders: [],
      VAT: "",
      VATSales: "",
      VatExempt: "",
      totalDue: ""
    };
  },
  props: ["invoiceReciept"],
  mounted() {
    this.getOrderList();
  },
  computed: {
    // checkOrder() {
    //   return this.$store.state.POS.orderList;
    // }
  },
  methods: {
    async getOrderList() {
      console.log(await this.invoiceReciept);
      await this.invoiceReciept.orderList.forEach(item => {
        this.orders.push({
          product_name: item.product_name,
          quantity: item.quantity,
          total: item.total
        });
      });
      this.VAT = this.invoiceReciept.VAT;
      this.VATSales = this.invoiceReciept.VATSales;
      this.VatExempt = this.invoiceReciept.VatExempt;
      this.totalDue = this.invoiceReciept.totalDue;
    },
    makePDF() {
      console.log("test");
      window.html2canvas = html2canvas;
      var doc = new jsPDF("p", "pt", "a4");
      doc.html(document.querySelector("#invoice-POS"), {
        callback: pdf => {
          pdf.save("test.pdf");
        }
      });
    },
    exportToPDF() {
      // html2pdf(this.$refs.document, {
      //   margin: 1,
      //   filename: "document.pdf",
      //   image: { type: "jpeg", quality: 0.98 },
      //   html2canvas: { dpi: 192, letterRendering: true },
      //   jsPDF: { unit: "in", format: "letter", orientation: "landscape" }
      // });
      //window.print();
      var element = document.getElementById("invoice-POS");
      var opt = {
        margin: 1,
        filename: "myfile.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      };
      html2pdf()
        .set(opt)
        .from(element)
        .save();
    }
  }
};
</script>

<style scoped>
#invoice-POS {
  box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5);
  padding: 2mm;
  margin: 0 auto;
  width: 50.8mm;
  background: #fff;
}
::selection {
  background: #f31544;
  color: #fff;
}
::moz-selection {
  background: #f31544;
  color: #fff;
}
h1 {
  font-size: 1.5em;
  color: #222;
}
h2 {
  font-size: 0.9em;
}
h3 {
  font-size: 1.2em;
  font-weight: 300;
  line-height: 2em;
}
h4 {
  font-size: 1.3em;
  font-weight: 800;
  line-height: 2em;
}
p {
  font-size: 0.7em;
  color: #666;
  line-height: 1.2em;
}

#top,
#mid,
#bot {
  /* Targets all id with 'col-' */
  border-bottom: 1px solid #eee;
}

#top {
  min-height: 100px;
}
#mid {
  min-height: 80px;
}
#bot {
  min-height: 50px;
}

#top .logo {
  /* float: left; */
  height: 60px;
  width: 60px;
  background: url(http://michaeltruong.ca/images/logo1.png) no-repeat;
  background-size: 60px 60px;
}
.clientlogo {
  float: left;
  height: 60px;
  width: 60px;
  background: url(http://michaeltruong.ca/images/client.jpg) no-repeat;
  background-size: 60px 60px;
  border-radius: 50px;
}
.info {
  display: block;
  /* float: left; */
  margin-left: 0;
}
.title {
  float: right;
}
.title p {
  text-align: right;
}
table {
  width: 100%;
  border-collapse: collapse;
}
td {
  /* padding: 5px 0 5px 15px;
  border: 1px solid #eee; */
}
.tabletitle {
  /* padding: 5px; */
  font-size: 0.5em;
  background: #eee;
}
.service {
  border-bottom: 1px solid #eee;
}
.item {
  width: 24mm;
}
.itemtext {
  font-size: 0.5em;
}
.itemtextTotal {
  font-size: 0.5em;
  /* background: #eee; */
  border-bottom: 1px solid #eee;
}
#legalcopy {
  margin-top: 5mm;
}
</style>
