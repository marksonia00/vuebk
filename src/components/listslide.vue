<template>
  <div class="hello">
    <navbar></navbar>
      <b-container class="mt-3" fluid>
        <b-row class="flex-nowrap overflow-auto" style="min-height: 88vh"> 
            <b-col class="list" 
                    v-for="card in cards" 
                    :key="card.id">
              <b-card :header="card.id.toString()" @click="modal(card.id)"> 
                <b-card-group columns class="mb-4 flex-nowrap cardgroup overflow-auto">
                  <b-card 
                    class="card mb-2" 
                    v-for="task in card.tasklist" 
                    :key="task.id"
                    @click.stop="makeToast(card.id, task.id)"
                    @click.right.prevent.stop="deletecard(card.id, task.id)"
                    draggable>
                    {{task.name}}
                  </b-card>
                </b-card-group>
                <div class="card addcard p-2" @click.stop="addcard(card.id)">
                  Add Card
                </div>
              </b-card>
            </b-col>
            <b-col class="list">
              <b-card header="Add List" @click="addlist">
              </b-card>
            </b-col>
        </b-row> 
      </b-container>
      <b-modal v-model="modalShow" hide-footer>
        <b-button variant="danger" 
          size="sm" 
          class="float-right" 
          @click="deletelist">Delete</b-button>
      </b-modal>
  </div>
</template>

<script>
import navbar from "./navbar"

export default {
  name: 'Listslide',
  components:{
    navbar: navbar
  },
  data () {
    return {
      modalShow: false,
      modaldata: {},
      cards: []
    }
  },
  methods:{
    deletelist(){
      this.cards.splice(this.cards.findIndex(card => card.id == this.modaldata.id), 1)
      this.modalShow = !this.modalShow
    },
    addlist(){
      this.cards.push({id: this.cards[0]? this.cards[this.cards.length-1].id+1 :1, tasklist: []})
    },
    deletecard(card, task){
      let deletefrom = this.cards.findIndex(cd => cd.id == card)
      this.cards[deletefrom].tasklist.splice(this.cards[deletefrom].tasklist.findIndex(tk => tk.id == task), 1)
    },
    addcard(id){
      let addto = this.cards.findIndex(card => card.id == id)
      let addid = this.cards[addto].tasklist[0]? this.cards[addto].tasklist[this.cards[addto].tasklist.length-1].id+1 :1
      this.cards[addto].tasklist.push({id: addid,name: 'a'})
    },
    modal(id){
      this.modalShow = !this.modalShow
      this.modaldata.id = id
    },
    makeToast(card, task) {
        this.$bvToast.toast(`Toggle >> slot:${card} id:${task}`, {
          title: 'Tips',
          autoHideDelay: 3000,
          appendToast: false
        })
    }
  },
  created(){
      for(let i=1;i<5;i++)
        this.cards.push({id: i, tasklist: []})
      
      this.cards.forEach(card => {
        for(let i=1;i<5;i++)
            card.tasklist.push({id: i,name: 'a'})
      })
  }
}
</script>

<style lang="stylus" scoped>
.flex-nowrap
  display flex
  flex-wrap nowrap

.cardgroup
  max-height 55vh
  flex-direction column
  
::-webkit-scrollbar 
  width: 2px
  transform translateX(5px) 
::-webkit-scrollbar-track 
  background: #f1f1f1
::-webkit-scrollbar-thumb 
  background: #888

.list
  max-width 225px
  min-width 225px
  transform translateY(0px) 
  transition transform .3s linear .01s
  &:hover
    transform translateY(-10px) 

.card
  cursor pointer
  transition: all .3s linear .01s
  &:hover
    background-color rgb(229, 229, 229)
.addcard
  min-height 45px
</style>