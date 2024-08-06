import React, { useState } from "react";
import './subscription.css';
import PaymentComponent from './PaymentComponent';

const Subs = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlanAmount, setSelectedPlanAmount] = useState(0);

  const handleSubscribeClick = (amount) => {
    setSelectedPlanAmount(amount);
    setShowPayment(true);
  };

  return (
    <div className="subscription">
      {!showPayment ? (
        <>
          <div className="plans">
            <div className="things">
              <div className="head">Basic</div>
              <div className="money">₹50/month</div>
              <div className="features">₹550 billed annually (8.3% save)</div>
              <div className="Services">
                <div>✔️ Post Character limit up to 500</div>
                <div>✔️ Daily post limit up to 10</div>
                <div>❌ Verified badge</div>
                <div>❌ Unlimited posts</div>
                <div>❌ Boost post</div>
                <div>❌ Customize language</div>
              </div>
              <div>
                <button className="Subscribe_btn" onClick={() => handleSubscribeClick(55000)}>Subscribe</button>
              </div>
            </div>
          </div>
          <div className="plans">
            <div className="things">
              <div className="head">Premium</div>
              <div className="money">₹80/month</div>
              <div className="features">₹850 billed annually (9.3% save)</div>
              <div className="Services">
                <div>✔️ Post Character limit up to 500</div>
                <div>✔️ Daily post limit up to 10</div>
                <div>✔️ Verified badge</div>
                <div>❌ Unlimited posts</div>
                <div>❌ Boost post</div>
                <div>✔️ Customize language</div>
              </div>
              <div>
                <button className="Subscribe_btn" onClick={() => handleSubscribeClick(85000)}>Subscribe</button>
              </div>
            </div>
          </div>
          <div className="plans">
            <div className="things">
              <div className="head">Premium +</div>
              <div className="money">₹150/month</div>
              <div className="features">₹1600 billed annually (11.1% save)</div>
              <div className="Services">
                <div>✔️ Post Character limit up to 500</div>
                <div>✔️ Daily post limit up to 10</div>
                <div>✔️ Verified badge</div>
                <div>✔️ Unlimited posts</div>
                <div>✔️ Boost post</div>
                <div>✔️ Customize language</div>
              </div>
              <div>
                <button className="Subscribe_btn" onClick={() => handleSubscribeClick(160000)}>Subscribe</button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <PaymentComponent amount={selectedPlanAmount} />
      )}
    </div>
  );
};

export default Subs;
