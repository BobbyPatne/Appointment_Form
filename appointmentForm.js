import { LightningElement,wire } from 'lwc';

import createAppointment from '@salesforce/apex/AppointmentController.createAppointment';
import getAppointmentSlots from '@salesforce/apex/AppointmentController.getAppointmentSlots';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getContacts from '@salesforce/apex/LWCContactController.getContacts';


export default class AppointmentForm extends LightningElement {
   selectedDate;
   selectedTime;
   selectedContact;
   selectedSubject;
   selectedDescription;
   selectedName;
   newArray =[];
   slotCheck;
   
   contactsOptions;
  
   @wire(getAppointmentSlots,{aptDate:'$selectedDate',TimeInteger:'$newArray'})
   wiredSlots({ error, data }) {
    console.log('Slots Data ',data);
    
    if(data){
 this.slotCheck = data;
    }
    else{
        console.log(error);
        
    }
   }
       

   @wire(getContacts)
   wiredContacts({ error, data }) {
       if (data) {
            this.contactsOptions = data.map(contact => {
                console.log({ label:`${contact.FirstName} ${contact.LastName}`, value: contact.Id});
                
                return { label:`${contact.FirstName} ${contact.LastName}`, value: contact.Id };
            });
               console.log(this.contactsOptions);
        console.log(data);
        

           
       } else if (error) {
           console.log(error);
           
       }
   }


//    handleName(event){
//     this.selectedName = event.target.value;
//    }
 
   handleDescription(event){
    this.selectedDescription = event.target.value;
   }

   handleTime(event){
    this.selectedTime = event.target.value;
    this.createFormattedTime(this.selectedTime);
   
    
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


    // checkHandler(){
    //     let formattedTime2 =this.createFormattedTime(this.selectedTime);
    //     getAppointmentSlots({aptDate:this.selectedDate, TimeInteger:formattedTime2})
    //     .then(result=>{
    //         if(result){
    //             this.show =false;
    //             this.slotCheck = true;
    //             this.showToast('Slot is Available', 'you can book this Slot','success'); 
    //         } else{
    //             this.slotCheck = true;
    //             this.showToast('Sorry Slot is not Available', 'you can not book this Slot','error'); 
    //         }
           
           
    // })
    //      .catch(error=>{
    //        console.log('Error found while creating',error);
           
    //      })
    // }

submitHandler(){
const formattedTime = this.createFormattedTime(this.selectedTime);
 if(!this.slotCheck){
    this.showToast('This Slot is Booked', 'Please Select the another time or Date','error');
 } 
 else{
    createAppointment({ AppointmentDate:this.selectedDate, AppointmentTime:formattedTime,
        Sub:this.selectedSubject, Descr:this.selectedDescription,contactId:this.selectedContact   
    })
        .then(result=>{
            console.log(result);
            if(!result){
                console.log(result);
                
            this.showToast('Successful', 'Appointment created Successfully','success');           
            this.slotCheck = true;
            this.resetHandle();
           
        } else {
            console.log(result);
                
            this.showToast('Duplicate Found', 'You can not fill this , please select the another date ','warning');     
            this.slotCheck = true;
            this.clearDateAndTime();
        }
           
    })
         .catch(error=>{
           console.log('Error found while creating',error);
           this.showToast('Error',error,'error');
         })
 }
}


resetHandle(){
    this.selectedDate ='';
   this.selectedTime='';
   this.selectedContact='';
   this.selectedSubject='';
   this.selectedDescription='';
   this.selectedName='';
}

clearDateAndTime(){
    this.selectedDate='';
    this.selectedTime='';
}

createFormattedTime(timestring){
    let [time, ms] = timestring.split('.'); // "00:00:00".012"
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