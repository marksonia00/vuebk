<template>
    <div class="bg-light overflow-hidden">
        <navbar class="sticky-top"></navbar>
        <b-container fluid class="m-0 bg-white">
            <b-row class="flex-nowrap overflow-auto">
                <b-nav pills vertical class="nav m-2 bg-transparent">
                    <h3><b-badge variant="light" class="mb-3">Sprint</b-badge></h3>
                    <b-nav-item v-for="sprint in sprintlist" 
                                :key="sprint" 
                                variant="light"
                                @click="focusSprint != sprint? focusSprint = sprint: focusSprint = ''"
                                :active="focusSprint == sprint"
                                :style="{maxHeight: focSprintH(sprint), minHeight: focSprintH(sprint)}">
                                {{sprint}}
                    </b-nav-item>
                </b-nav>
                <b-col class="flex-nowrap overflow-auto">  
                    <b-row class="flex-nowrap">
                        <b-col class="member text-left" v-for="state in statelist" :key="state">
                            <h3><b-badge variant="light">{{state}}</b-badge></h3>
                        </b-col>
                    </b-row>
                    <b-row class="sprint flex-nowrap" v-for="sprint in sprintlist" :key="sprint"
                            :style="{maxHeight: focSprintH(sprint), minHeight: focSprintH(sprint)}">    
                        <b-col class="member my-2 border-bottom overflow-auto text-left" 
                            v-for="list in team" 
                            :key="list.state"  
                            v-show="list.sprint === sprint"
                            data-role="drag-drop-container" 
                            @drop="drop($event, list)" 
                            @dragover.prevent
                            :style="{backgroundColor: focSprintBK(list.sprint)}">                                 
                            <div class="my-1" 
                                v-for="task in list.tasklist" 
                                :key="task.TASKID"
                                draggable="true" 
                                @dragstart="dragstart($event, task, list)"
                                @dragend="dragend"
                                @click="taskinfo(task.TASKID)"
                                style="cursor: pointer; max-height: 45px;">
                                <b-card class="card px-2 shadow-sm" align="left" no-body 
                                        :style="{borderLeft: bordcolor(task.PRIORITY), opacity: focusOwnerBk(task.OWNER)}">
                                    <b-row class="small text-muted">
                                        <b-col class="mb-1 pr-0">
                                            {{task.TASKID}}
                                        </b-col>
                                        <b-col v-if="!isfocusSpt(list.sprint)" class="mb-1 px-0">
                                            {{task.NAME.length > 10 ? task.NAME.substr(0,10)+'...' : task.NAME }}</b-col>
                                        <b-col v-if="!isfocusSpt(list.sprint)" class="mb-1 pl-0 text-right">
                                            <b-badge class="ownerTag" 
                                                    @click.stop="focusOwner != task.OWNER? focusOwner = task.OWNER : focusOwner = ''">
                                                    {{task.OWNER}}
                                            </b-badge>
                                        </b-col>
                                        <b-col v-if="isfocusSpt(list.sprint)" cols="4" class="mb-1 text-right">
                                            {{task.REMAININGPOINT}} / {{task.TOTALPOINT}}
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col v-if="isfocusSpt(list.sprint)" class="mb-1">
                                            {{task.NAME.length > 15 ? task.NAME.substr(0,15)+'...' : task.NAME}}</b-col>
                                        <b-col v-if="isfocusSpt(list.sprint)" cols="4" class="mb-1 text-right">
                                            <b-badge class="ownerTag" 
                                                    @click.stop="focusOwner != task.OWNER? focusOwner = task.OWNER : focusOwner = ''">
                                                    {{task.OWNER}}
                                            </b-badge>
                                        </b-col>
                                    </b-row>
                                </b-card>
                            </div>
                        </b-col>
                    </b-row>    
                </b-col>
            </b-row>
        </b-container>
        <b-modal centered hide-header hide-footer v-model="modalShow">
            <b-table striped hover stacked :items="TaskInfo"></b-table>
        </b-modal>
    </div>
</template>
    
<script>
import navbar from "./navbar"
import { mapActions } from "vuex"

export default {
    name: 'Taskinfo',
    components:{
        navbar: navbar
    },
    data (){
        return {
            modalShow: false,
            tasklist: [],
            focusOwner: "",
            focusSprint: "",
            TaskInfo: [{}],
            // displayfield: ["TASKID", "NAME"],
            statelist: ["TO DO", "In Process", "Checking", "DONE"],
            sprintlist: [],
            team: []                
        }
    },
    methods:{
        focusOwnerBk(ow){
            return this.focusOwner == ow || this.focusOwner == ''? 1 : .2
        },
        isfocusSpt(sprint){
            return this.focusSprint == sprint || this.focusSprint == ''
        },
        focSprintBK(sprint){
            return this.focusSprint == sprint || this.focusSprint == ''? '#f4f4f6' : '#c7c7c7'
        },
        focSprintH(sprint){
            return this.focusSprint == sprint || this.focusSprint == ''? '33vh' : '15vh'
        },
        bordcolor(pri){
            let bd = "5px "
            switch (pri) {
                case 0:
                    bd += "#f0360f solid"
                    break;
                case 1:
                    bd += "#f0df0f solid"
                    break;
                case 2:
                    bd += "#0f67f0 solid"
                    break;
            }
            return bd
        },
        dragstart(event, task, list){
            event.dataTransfer.setData('task', task.TASKID)
            event.dataTransfer.setData('state', list.state)
            event.dataTransfer.setData('sprint', list.sprint)
        },
        drop(event, list){
                if(event.dataTransfer.getData('state') != list.state && event.dataTransfer.getData('sprint') == list.sprint){
                    // let postowner = {id: event.dataTransfer.getData('task').trim(), owner: member.name}
                    // this.changeowner(postowner)
                    let startindex = this.team.findIndex(li => li.sprint == list.sprint) + this.statelist.findIndex(st => st == event.dataTransfer.getData('state'))
                    let TaskID = this.team[startindex].tasklist.findIndex(task => task.TASKID == event.dataTransfer.getData('task'))
                    list.tasklist.push(this.team[startindex].tasklist[TaskID])
                    this.team[startindex].tasklist.splice(TaskID, 1)
                    }
        },
        dragend(event){
            event.dataTransfer.clearData()
        },
        async taskinfo(id){
            this.TaskInfo = await this.gettaskinfo(id)
            this.modalShow = !this.modalShow
        },
        ...mapActions(["gettaskinfo"])
    },
    async created(){
        this.tasklist = await this.gettaskinfo(0)
        this.sprintlist = new Set(this.tasklist.map(task => task.SPRINTID.trim()).sort())
        this.sprintlist.forEach(sprint => {
            for(let st in this.statelist)
                this.team.push({sprint: sprint, state: this.statelist[st], tasklist:[] })
        })

        this.tasklist.forEach(task =>{
            let index = this.team.findIndex(list => list.sprint == task.SPRINTID.trim())
            this.team[index + task.STATUS].tasklist.push(task)
        })  
    }
}
</script>

<style lang="stylus" scoped>
.card
    transition all .1s linear .1s
    &:hover 
        background-color #fceed9

.sprint
    transition all .3s linear .1s

.member
    min-width: 280px 
    max-width: 280px
    transition all .5s ease-out .1s

.nav
    max-width: 115px
    min-width: 115px
    transition all .5s ease-out .1s

.ownerTag
    transition all .1s linear .1s
    &:hover 
        background-color #2767d3

::-webkit-scrollbar 
  width: 2px
  transform translateX(7px) 
::-webkit-scrollbar-track 
  background: #f1f1f1
::-webkit-scrollbar-thumb 
  background: #888
</style>
