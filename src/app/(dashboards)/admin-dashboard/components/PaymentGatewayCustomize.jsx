import React from 'react'

export default function PaymentGatewayCustomize({paymentGateway}) {
    switch(paymentGateway){
        case 'BKash Mobile Banking' : return <div className=' text-[#D12053] text-sm  '>{paymentGateway}</div>;
        case 'Nagad' : return <div className='text-sm text-[#F26522] '>{paymentGateway}</div>;
        case 'COD' : return <div className='text-sm text-green-500'>Cash On Delivery</div>;
        default: return <div className='text-sm text-yellow-800 '>{paymentGateway}</div>
    }
}
