<template>
  <div id="home">
    <section class="section">
      <div class="container">
        <div
          class="columns is-mobile"
          v-if="metamarkStatus == 'CONNECTION_REFUSED'"
        >
          <div class="column">
            <a
              href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
              target="_blank"
              class="button is-danger is-fullwidth"
              >ระบบไม่พร้อมให้ใช้บริการ Connection Refused</a
            >
          </div>
        </div>
        <div
          class="column is-full"
          v-else-if="metamarkStatus == 'METAMARK_INSTALLED'"
        >
          <div class="column is-full">
            <b-button
              type="button"
              class="pb-2"
              :variant="tab.colorClass"
              v-for="(tab, index) in metaTabAction"
              v-bind:key="tab.id"
              @click="() => (metaTabActive = index)"
            >
              {{ tab.text }}
            </b-button>
          </div>
        </div>
        <div class="columns" v-if="metaTabActive == 'transaction'">
          <div class="column">
            <profile
              :public-address="wallet.publicAddress"
              :balance="wallet.balance.eth"
            >
            </profile>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Web3 from "web3/dist/web3.min.js";
import web3Service from "@/services/web3.js";
import profile from "@/components/profile.vue";
export default {
  name: "home",
  components: {
    profile,
  },
  data() {
    return {
      metamarkStatus: "CONNECTION_REFUSED",
      personal: {},
      wallet: { publicAddress: "", balance: { wei: 0, eth: 0 } },
      metaTabActive: "address",
      metaTabAction: {
        address: {
          colorClass: "primary",
          text: "Address In Blockchain Network",
        },
        transaction: {
          colorClass: "info",
          text: "Sending Transaction",
        },
        create: {
          colorClass: "success",
          text: "Account Created",
        },
      },
      addressReceive: [],
      transaction: {
        receive: null,
        value: 0,
        gasPrice: 100000, //1000000000
        gas: 100000,
      },
      web3: null,
    };
  },
  methods: {
    a1() {
      web3Service
        .hiweb3()
        .then((result) => {
          console.log(result);
          console.log("hi");
        })
        .catch(() => {});
    },
    hi() {
      console.log(Web3.version);
    },
    metamask_checkinstall() {
      const hostProvider = "http://localhost:8545";
      console.log("Web3 Version ::==" + Web3.version);
      fetch(hostProvider)
        .then(() => {
          if (typeof window.ethereum === "undefined") {
            this.metamarkStatus = "METAMARK_NOT_INSTALL"; // Matemark Not install
            //console.log('MetaMask is not install !!!')
          } else {
            this.metamarkStatus = "METAMARK_INSTALLED";
            //console.log('MetaMask is installed!')

            try {
              const web3Provider = new Web3(
                new Web3.providers.HttpProvider(hostProvider)
                //new Web3.providers.WebsocketProvider(hostProviderSocket)
              );
              this.web3 = web3Provider;
              console.log("this.web3 ::==", this.web3);
            } catch (error) {
              console.log("error ", error);
            }
          }
        })
        .catch(() => {
          this.metamarkStatus = "CONNECTION_REFUSED";
          alert("Node Network Not Avaliable !!");
        });
    },
    async getAccountInfo() {
      console.log("getAccountInfo ::==");
      const { utils } = this.web3;
      const [publicAddress, ...receives] = await this.web3.eth.getAccounts();
      console.log("publicAddress ::==", publicAddress);
      this.addressReceive = await this.mappingBalance(receives);
      if (publicAddress) {
        console.log("this.addressReceive ::==", this.addressReceive);
        //console.log('publicAddress ::==' + publicAddress);
        const balance = await this.web3.eth.getBalance(publicAddress);
        this.wallet = {
          publicAddress,
          balance: {
            wei: balance,
            eth: utils.fromWei(balance, "ether"),
          },
        };
        console.log("this.wallet ::==" + JSON.stringify(this.wallet));
      }
    },
    mappingBalance(receives) {
      const { utils } = this.web3;
      const mapper = (receives || []).map(async (address, index) => {
        console.log(index);
        const balance = await this.web3.eth.getBalance(address);
        return {
          address,
          balance: {
            wei: balance,
            eth: utils.fromWei(balance, "ether"),
          },
        };
      });
      console.log("mapper ::==", mapper);
      return Promise.all(mapper);
    },
  },
  created() {
    this.hi();
    this.metamask_checkinstall();
  },
  watch: {
    metamarkStatus(newVal) {
      if ("METAMARK_INSTALLED" == newVal) {
        this.getAccountInfo();
      }
    },
  },
};
</script>

<style></style>
