<template>
  <div class="hello">
    <navbar></navbar>
    <div class="team flex-col" >
      <div class="member flex-col" v-for="member in team" :key="member.name">
        <h2><b-badge variant="secondary">{{member.name}}</b-badge></h2>
        <div class="tasklist flex-col" 
              data-role="drag-drop-container" 
              @drop="drop($event, member)" 
              @dragover.prevent>
          <div class="task flex-col shadow" 
              v-for="task in member.tasklist" 
              :key="task.TASKID" draggable="true" 
              @dragstart="dragstart($event, task, member)"
              @dragend="dragend"
              @click="taskinfo(task.TASKID)">  
                <b-table striped hover stacked small :items="[task]" :fields="displayfield"></b-table>
          </div>
        </div>
      </div>
    </div>
    <b-modal centered hide-header hide-footer v-model="modalShow">
      <b-table striped hover stacked :items="TaskInfo"></b-table>
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import navbar from "./navbar"

export default {
  name: 'HelloWorld',
  components:{
    navbar : navbar
  },
  data () {
    return {
      modalShow: false,
      TaskInfo: [{}],
      tasklist: [],
      displayfield: ["SPRINTID", "TASKID", "NAME"],
      team: [ {name : 'Austin', tasklist:[]},
              {name : 'Brenda', tasklist:[]},
              {name : 'Chrisy', tasklist:[]},
              {name : 'Dennis', tasklist:[]}]                
    }
  },
  computed:{
    ...mapGetters(["projectinfo"])
  },
  methods:{
    dragstart(event, task, member){
      event.dataTransfer.setData('task', task.TASKID)
      event.dataTransfer.setData('member', member.name)
    },
    drop(event, member){
      if(event.dataTransfer.getData('member') != member.name){
        let postowner = {id: event.dataTransfer.getData('task').trim(), owner: member.name}
        this.changeowner(postowner)
        var fromMember = this.team.map(member => member.name).indexOf(event.dataTransfer.getData('member'))
        var TID = this.team[fromMember].tasklist.map(task => task.TASKID).indexOf(event.dataTransfer.getData('task'))
        member.tasklist.push(this.team[fromMember].tasklist[TID])
        this.team[fromMember].tasklist.splice(TID, 1)
      }
    },
    dragend(event){
      event.dataTransfer.clearData()
    },
    async taskinfo(id){
      this.TaskInfo = await this.gettaskinfo(id)
      this.modalShow = !this.modalShow
    },
    ...mapActions(["gettaskinfo", "changeowner"])
  },
  async created(){
    this.tasklist = await this.gettaskinfo("0")
    this.tasklist.forEach(task =>{
          let TargetMember = this.team.map(member => member.name).indexOf(task.OWNER.trim())
          this.team[TargetMember].tasklist.push(task)
          })
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.flex-col{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.team{
  flex-direction: row;
  align-content: space-around;
  background: rgba(175, 170, 170, 0.692) url("../assets/teambg.jpg");
  background-blend-mode: multiply;
  width: 100%;
  height: 92vh;
}
.member{
  background-color: rgba(255, 255, 255, 0.774);
  width: 28%;
  height: 88%;
  margin: 3% 1%;
  color: rgb(24, 25, 26);
}
.tasklist{
  justify-content: flex-start;
  height: 86%;
  overflow: auto;
}
.task{
  justify-content: center;
  align-items: flex-start;
  background-color: rgb(238, 235, 235);
  margin: 3% 4%;
  padding: 2%;
  border-radius: 5px;
  cursor: pointer;
  color: rgb(31, 30, 30)
}
</style>
