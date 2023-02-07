import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignalRService } from '../signalr.service';
import { MessageVM } from './MessageVM';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  messageList: MessageVM[] = [];
  message: MessageVM = {
    createdAt: new Date().toISOString(),
    messageBody: '',
    userName: '',
    groupName: ''
  };

  constructor(
    private signalRService: SignalRService,
  ) { }

  ngOnInit(): void {
    this.subscribeToEvents();
  }

  private addToInbox(obj: MessageVM) {
    const newObj = {
      userName: obj.userName,
      messageBody: obj.messageBody,
      createdAt: new Date().toISOString(),
      groupName: obj.groupName
    }
    this.messageList.push(newObj);
  }

  sendMessage(): void {
    this.message.userName = localStorage.getItem('user_name');

    if (this.message.userName.length === 0 ||
      this.message.messageBody.length === 0) {
      return;
    }

    this.signalRService.sendMessage(this.message).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.log('sendMessage', err);
      },
      complete: () => {
        this.message.messageBody = '';
      }
    });
  }

  private subscribeToEvents() {
    // start a connection
    this.signalRService.startConnection().then(() => {
      console.log("connected");

      // register for ALL relay
      this.signalRService.listenToAllMessages();

      // subscribe to messages received
      this.signalRService.allMessagesObject$
        .subscribe((res: MessageVM) => {
          this.addToInbox(res);
        });
    });
  }
}
