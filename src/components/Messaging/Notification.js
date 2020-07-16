import {notification} from 'antd';
import '../../notification.css'
import React from 'react';

/*import { Button, notification } from 'antd';

const close = () => {
  console.log(
    'Notification was closed. Either the close button was clicked or duration time elapsed.',
  );
};

const openNotification = () => {
  const key = `open${Date.now()}`;
  const btn = (
    <Button type="primary" size="small" onClick={() => notification.close(key)}>
      Confirm
    </Button>
  );
  notification.open({
    message: 'Notification Title',
    description:
      'A function will be be called after the notification is closed (automatically after the "duration" time of manually).',
    btn,
    key,
    onClose: close,
  });
};*/

function Notification() {

    const onOpenNotificationWarning = () => {

        notification.warn({

            message: 'AO.Flight Application',

            className: 'warnNotification',

            description: (<div>Flight AFR123 has been delayed.</div>),

            closeIcon: (

                <span className="notification-buttons">

              </span>

            ),

            placement: "bottomRight",

            duration: 0,

        });

    };


    const onOpenNotificationSuccess = () => {

        notification.success({

            message: 'DNP Application',

            className: 'successNotification',

            description: (<div>Network plan of 1st APRIL 2020 and weather assessment has been published.</div>),

            placement: "bottomRight",

            duration: 0

        });


    };


    const onOpenNotificationAlert = () => {

        notification.error({

            message: 'DNP Application',

            className: 'errorNotification',

            description: (<div>Network plan of 1st APRIL 2020 and weather assessment has not been published.</div>),

            placement: "bottomRight",

            duration: 0

        });

    };
}

