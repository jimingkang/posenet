import { NgModule } from '@angular/core';
import { HomeModule } from './home/home.module';
import { SheetListModule } from './sheet-list/sheet-list.module';
import { SheetInfoModule } from './sheet-info/sheet-info.module';
import { SongInfoModule } from './song-info/song-info.module';
import { SingerModule } from './singer/singer.module';
import { MemberModule } from './member/member.module';
import { MyrtcModule } from './myrtc/myrtc.module';



@NgModule({
  declarations: [],
  imports: [
    HomeModule,
    SheetListModule,
    SheetInfoModule,
    SongInfoModule,
    SingerModule,
    MemberModule,
    MyrtcModule
  ],
  exports: [
    HomeModule,
    SheetListModule,
    SheetInfoModule,
    SongInfoModule,
    SingerModule,
    MemberModule,
    MyrtcModule
  ]
})
export class PagesModule { }
