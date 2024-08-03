import { LightningElement,wire,api } from 'lwc';

import createAppointment from '@salesforce/apex/AppointmentController.createAppointment';
import getAppointmentSlots from '@salesforce/apex/AppointmentController.getAppointmentSlots';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class AppointmentForm extends LightningElement {
   selectedDate;
   selectedTime;
   selectedContact;
   selectedSubject;
   selectedDescription;
   selectedName;
   newArray =[];
   slotCheck= true;
   show=false;
  

   handleName(event){
    this.selectedName = event.target.value;
   }
 
   handleDescription(event){
    this.selectedDescription = event.target.value;
   }

   handleTime(event){
    this.selectedTime = event.target.value;
   
    
        }
    handleDate(event){
        this.selectedDate  = event.target.value;
      
    }
    handleContact(event){
     this.selectedContact = event.target.value;
     console.log('selected contact', this.selectedContact);
     console.log('selected contact json', JSON.stringify(event.target.value));
    }
    handleSubject(event){
        this.selectedSubject = event.target.value;
    }


    checkHandler(){
        let formattedTime2 =this.createFormattedTime(this.selectedTime);
        getAppointmentSlots({aptDate:this.selectedDate, TimeInteger:formattedTime2})
        .then(result=>{
            if(result){
                this.show =true;
                this.slotCheck = false;
                this.showToast('Slot is Available', 'you can book this Slot','success'); 
            } else{
                this.slotCheck = true;
                this.showToast('Sorry Slot is not Available', 'you can not book this Slot','error'); 
            }
           
           
    })
         .catch(error=>{
           console.log('Error found while creating',error);
           
         })
    }

submitHandler(){
const formattedTime = this.createFormattedTime(this.selectedTime);

const contactField = this.template.querySelector(".contactclass");
console.log('values is ',contactField);
if(contactField.value === undefined){
    contactField.setCustomValidity("Please Select the Contact");
} else{
    contactField.setCustomValidity("");
    
    createAppointment({ AppointmentDate:this.selectedDate, AppointmentTime:formattedTime,
        Sub:this.selectedSubject, Descr:this.selectedDescription,contactId:this.selectedContact,Name:this.selectedName   
    })
        .then(result=>{
            console.log(result);
            if(!result){
                console.log(result);
                
            this.showToast('Successful', result,'success');           
            this.slotCheck = true;
            this.resetHandle();
           
        } else {
            console.log(result);
                
            this.showToast('Duplicate Found', 'You can not fill this , please select the another date ','warning');     
            this.slotCheck = true;
            this.resetHandle();
        }
           
           // window.location.reload();
    })
         .catch(error=>{
           console.log('Error found while creating',error);
           this.showToast('Error',result,'error');
         })
}

contactField.reportValidity();

}

resetHandle(){
    this.selectedDate ='';
   this.selectedTime='';
   this.selectedContact='';
   this.selectedSubject='';
   this.selectedDescription='';
   this.selectedName='';
}




createFormattedTime(timestring){
    let [time, ms] = timestring.split('.'); // ms
    let [hh, mm, ss] = time.split(':');
     this.newArray = [parseInt(hh, 10), parseInt(mm, 10), parseInt(ss, 10), parseInt(ms, 10)];
     return  this.newArray;
   
    }

showToast(Header,Subheader,Way) {
    const eve = new ShowToastEvent({
        title: Header,
        message: Subheader,
        variant: Way,
        //mode: 'dismissable'
    })
    this.dispatchEvent(eve);
}
  

}