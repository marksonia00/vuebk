<template>
    <div class="bg-light overflow-hidden">
        <navbar class="sticky-top"></navbar>
        <b-container fluid class="m-0 bg-white">
            <b-row>
                <b-nav pills vertical class="m-2 bg-transparent" style="max-width: 115px; min-width: 115px;">
                    <b-badge variant="light" class="mb-3"><h4>Sprint</h4></b-badge>
                    <b-nav-item v-for="sprint in sprintlist" 
                                :key="sprint" 
                                @click="viewsprint = sprint" 
                                :active="viewsprint == sprint" 
                                variant="light">
                                {{sprint}}
                    </b-nav-item>
                </b-nav>
                <b-col class="member m-1 bg-light overflow-auto text-left" 
                        v-for="list in team" 
                        :key="list.state"  
                        v-show="viewsprint === list.sprint"
                        data-role="drag-drop-container" 
                        @drop="drop($event, list)" 
                        @dragover.prevent
                        style="max-height: 88vh; min-height: 88vh; min-width: 280px; max-width: 280px;">
                    <h3><b-badge variant="light">{{list.state}}</b-badge></h3>
                    <div class="mb-3" 
                        v-for="task in list.tasklist" 
                        :key="task.id"
                        draggable="true" 
                        @dragstart="dragstart($event, task, list)"
                        @dragend="dragend"
                        @click="taskinfo(task.TASKID)"
                        style="cursor: pointer; max-height: 45px;">
                        <b-card class="px-2 shadow-sm" align="left" bg-variant="white" border-variant="light" no-body>
                            <b-row class="small text-muted">
                                <b-col class="mb-1">{{task.TASKID}}</b-col>
                                <b-col cols="4" class="mb-1 text-right">{{task.REMAININGPOINT}} / {{task.TOTALPOINT}}</b-col>
                            </b-row>
                            <b-row>
                                <b-col class="mb-1">{{task.NAME}}</b-col>
                                <b-col cols="4" class="mb-1 text-right"><b-badge>{{task.OWNER}}</b-badge></b-col>
                            </b-row>
                        </b-card>
                    </div>
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
            viewsprint: "S0001",
            TaskInfo: [{}],
            // displayfield: ["TASKID", "NAME"],
            statelist: ["TO DO", "In Process", "Checking", "DONE"],
            sprintlist: [],
            team: []                
        }
    },
    methods:{
        dragstart(event, task, list){
            event.dataTransfer.setData('task', task.TASKID)
            event.dataTransfer.setData('state', list.state)
        },
        drop(event, list){
            if(event.dataTransfer.getData('state') != list.state){
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
        this.tasklist = await this.gettaskinfo("0")
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
