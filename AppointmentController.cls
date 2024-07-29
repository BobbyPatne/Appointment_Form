public class AppointmentController {
    @auraEnabled
    public static boolean getAppointmentSlots(date aptDate,List<Integer> TimeInteger){
        boolean isAvailable;
        
        if (TimeInteger != null && TimeInteger.size() == 4) {
            Integer hours = TimeInteger[0];
            Integer minutes = TimeInteger[1];
            Integer seconds = TimeInteger[2];
            Integer milliseconds = TimeInteger[3];
            
            // Create the Time instance
            Time availTime = Time.newInstance(hours, minutes, seconds, milliseconds); 
            
            
            
            List<Appointment_Slot__c> slotsList = [SELECT Id, Name, Start_Time__c, End_Time__c, isActive__c, Appointment_Date__c 
                                                   FROM Appointment_Slot__c 
                                                   WHERE Start_Time__c=:availTime 
                                                   AND Appointment_Date__c=:aptDate 
                                                   AND isActive__c =true];        
            system.debug('List '+slotsList);
            
            if(slotsList.isEmpty()){
                isAvailable = true;
            } else {
                isAvailable = false;
            }
        }
        return isAvailable; 
    }
    
    
    
    
    @auraEnabled 
    public static string createAppointment(date AppointmentDate,
                                           List<Integer> AppointmentTime,
                                           string Sub,
                                           string Descr,
                                           id contactId,
                                           string Name){
        //    SELECT Id, Appointment_Time__c, Appointment_Date__c, Subject__c, Contact__c, Description__c FROM Appointment_Detail__c 
        string message ='';  
        System.debug(AppointmentTime);
        if (AppointmentTime != null && AppointmentTime.size() == 4) {
            Integer hours = AppointmentTime[0];
            Integer minutes = AppointmentTime[1];
            Integer seconds = AppointmentTime[2];
            Integer milliseconds = AppointmentTime[3];
            
            // Create the Time instance
            Time myTime = Time.newInstance(hours, minutes, seconds, milliseconds); 
            
            
            try{ 
                Appointment_Slot__c AptSlot = new Appointment_Slot__c();
                AptSlot.isActive__c =true;
                AptSlot.Appointment_Date__c = AppointmentDate;
                AptSlot.Start_Time__c =myTime;
                insert AptSlot;
                
                
                Appointment_Detail__c  Apt = new Appointment_Detail__c ();
                Apt.Contact__c = contactId;
                Apt.Description__c = Descr;
                Apt.Appointment_Time__c =  myTime;
                Apt.Appointment_Date__c =  AppointmentDate;
                Apt.Name = Name;
                Apt.subject__c = Sub;
                insert Apt;
              
                
                message = 'Account created successful';
                
                //SELECT Id, Appointment_Date__c, Start_Time__c, isActive__c FROM Appointment_Slot__c
                
            } catch(exception e){
                system.debug(e.getMessage());
                message = 'account failed';
            }
            
        }
        return message;
    }
}