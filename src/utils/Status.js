import { STRINGS } from '../constants/strings';

export const statusImages = {
    pending:require('../assets/Images/orderstatusbg.png'),
    cooking: require('../assets/Images/cookingbg.png'),
    delivering: require('../assets/Images/deliverbg.png'),
    completed: require('../assets/Images/odercompletebg.png'),
  };

  export const statusText={
    pending:STRINGS.PENDING,
    cooking:STRINGS.COOKING,
    delivering:STRINGS.DELIVERING,
    completed:STRINGS.COMPLETED
  };
  export const statusheadingtext={
    pending:STRINGS.PROCESSING_ORDER,
    cooking:STRINGS.DELIVER,
    delivering:STRINGS.DELIVER,
    completed:STRINGS.ITS_HERE
  }
  export const statuscode={
    pending:0,
    cooking:1,
    delivering:2,
    completed:3
  }
   export const  orderstatus={
    pending:STRINGS.AWAITING,
    cooking:STRINGS.PREPARING,
    delivering:STRINGS.PICKED,
    completed:STRINGS.ARRIVED

   }