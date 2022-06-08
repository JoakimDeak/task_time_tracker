import { FC, useEffect } from 'react';

const PrivacyPolicy: FC = () => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
  }, []);
  return (
    <div style={{ overflow: 'hidden', height: '100vh' }}>
      <iframe style={{ height: '100%', width: '100%' }} src="https://www.iubenda.com/privacy-policy/69604854" />;
    </div>
  );
};

export default PrivacyPolicy;
