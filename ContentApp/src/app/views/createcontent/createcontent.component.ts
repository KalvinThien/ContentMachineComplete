import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContentService } from 'src/app/service/content.service';

@Component({
  selector: 'app-createcontent',
  templateUrl: './createcontent.component.html',
  styleUrls: ['./createcontent.component.css']
})
export class CreateContentComponent implements OnInit {

  private contentCreationStage = {
    INIT: 'init',
    TEXT: 'text',
    VIDEO: 'video',
    YT_LINK: 'youtube_link'
  }
  currentContentStage = this.contentCreationStage.INIT;
  
  constructor(
    private contentService: ContentService
  ) { /** */ }

  ngOnInit(): void {
    this.currentContentStage = this.contentCreationStage.INIT;
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
