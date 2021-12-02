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
        <div
          class="columns is-multiline is-mobile"
          v-if="metaTabActive == 'address'"
        >
          <div
            class="column is-one-quarter"
            v-for="(receive, index) in addressReceive"
            :key="index"
          >
            <wallet :wallet="receive"></wallet>
          </div>
        </div>
        <div class="columns" v-if="metaTabActive == 'transaction'">
          <div class="column">
            <profile
              :public-address="wallet.publicAddress"
              :balance="wallet.balance.eth"
            >
            </profile>
            <vue-metamask userMessage="msg" @onComplete="onComplete">
            </vue-metamask>
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder=" ex. 1"
                v-model="transaction.value"
                required
              />
            </div>
            <select class="input select" v-model="transaction.receive" required>
              <option
                :value="receive.address"
                v-for="(receive, index) in addressReceive"
                v-bind:key="index.id"
              >
                [{{ receive.address }}]: [{{ receive.balance.eth }}]
              </option>
            </select>
            <b-button v-on:click="sendingMetamarkTransaction">Send</b-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
/*eslint-disable */
import VueMetamask from "vue-metamask";
import Web3 from "web3/dist/web3.min.js";
import web3Service from "@/services/web3.js";
import profile from "@/components/profile.vue";
import wallet from "@/components/wallet.vue";
export default {
  name: "home",
  components: {
    profile,
    wallet,
    VueMetamask,
  },
  data() {
    return {
      msg: "This is demo net work",
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
        value: "",
        gasPrice: 100000, //1000000000
        gas: 100000,
      },
      web3: null,
      accounts: [],
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
    // async getAccount() {
    //   ethereum.request({ method: "eth_requestAccounts" });
    // },
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
    onComplete(data) {
      console.log("data:", data);
    },
    async sendingMetamarkTransaction() {
      const weiUtil = "femtoether";
      const { utils, eth } = this.web3;
      const { publicAddress } = this.wallet;
      const { value, gasPrice, gas, receive } = this.transaction;
      const transactionParameters = {
        from: ethereum.selectedAddress,
        to: receive,
        value: utils.toHex(utils.toWei(value, "ether")),
        gasPrice: utils.toHex(gasPrice),
        gas: utils.toHex(gas),
        nonce: "0x00",
      };
      //0x0Fa5190FF566b506D299557Bf2D028BdbE4a9ac4
      console.log(
        "transactionParameters ::==" + JSON.stringify(transactionParameters)
      );
      //return
      try {
        //const txHash = await eth.sendTransaction(transactionParameters)
        const txHash = await ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        });
        if (txHash) {
          await this.getAccountInfo();
          console.log("success!!!");
        }
      } catch (error) {
        console.log("error ::==", error);
      }
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
