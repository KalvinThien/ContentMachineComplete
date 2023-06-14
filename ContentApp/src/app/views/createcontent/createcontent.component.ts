import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ContentService } from 'src/app/service/content.service';

@Component({
  selector: 'app-createcontent',
  templateUrl: './createcontent.component.html',
  styleUrls: ['./createcontent.component.css'],
})
export class CreateContentComponent implements OnInit {
  private contentCreationStage = {
    INIT: 'init',
    TEXT: 'text',
    VIDEO: 'video',
    YT_LINK: 'youtube_link',
  };
  currentContentStage = this.contentCreationStage.INIT;

  inputPrompt: string = '';
  imagePrompt: string = '';

  frequencyOptions = [
    { title: 'Passive', description: 'Every day', value: 'passive' },
    { title: 'Professional', description: 'Every week', value: 'professional' },
    { title: 'Aggressive', description: 'Every month', value: 'aggressive' },
  ];
  selectedFrequency?: { title: string; desctipion: string; value: string };

  constructor(
    private contentService: ContentService,
    private messageService: MessageService
  ) {
    /** */
  }

  ngOnInit(): void {
    this.currentContentStage = this.contentCreationStage.INIT;
  }

  onCreateSelected(selectedOption?: {
    title: string;
    desctipion: string;
    value: string;
  }) {
    if (selectedOption === undefined) {
      this.messageService.add({
        severity: 'warning',
        summary: 'Something Is Missing',
        detail: 'Please select a frequency',
      });
      return;
    }

    this.contentService.createContent(
      this.inputPrompt,
      this.imagePrompt,
      selectedOption?.value
    );
  }

  generateWithText() {
    this.currentContentStage = this.contentCreationStage.TEXT;
  }
  generateWithVideo() {
    this.currentContentStage = this.contentCreationStage.VIDEO;
  }
  generateWithYoutube() {
    this.currentContentStage = this.contentCreationStage.YT_LINK;
  }
  onAutoGenerate() {
    throw new Error('Method not implemented.');
  }
  onAutoGenerateTopic() {
    throw new Error('Method not implemented.');
  }
}
