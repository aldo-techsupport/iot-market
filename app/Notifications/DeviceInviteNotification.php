<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class DeviceInviteNotification extends Notification
{
    use Queueable;

    public $deviceShare;

    /**
     * Create a new notification instance.
     */
    public function __construct($deviceShare)
    {
        $this->deviceShare = $deviceShare;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'device_invite',
            'share_id' => $this->deviceShare->id,
            'device_id' => $this->deviceShare->device_id,
            'device_name' => $this->deviceShare->device->name,
            'inviter_name' => $this->deviceShare->inviter->name,
            'token' => $this->deviceShare->token,
            'message' => "{$this->deviceShare->inviter->name} mengundang Anda mengakses perangkat {$this->deviceShare->device->name}.",
        ];
    }
}
