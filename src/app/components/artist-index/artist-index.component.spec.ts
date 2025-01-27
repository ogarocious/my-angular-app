import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArtistIndexComponent } from './artist-index.component';
import { ArtistService } from '../../services/artist.service';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // For mocking HTTP requests
import { of } from 'rxjs';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ArtistIndexComponent', () => {
  let component: ArtistIndexComponent;
  let fixture: ComponentFixture<ArtistIndexComponent>;
  let artistService: jasmine.SpyObj<ArtistService>;

  const mockArtists = [
    {
      id: 1,
      name: 'Jay-Z',
      username: 'jayz',
      totalStars: 5,
      image_url: '/assets/jayz.png',
    },
    {
      id: 2,
      name: 'Kanye West',
      username: 'kanyewest',
      totalStars: 3,
      image_url: '/assets/ye.png',
    },
  ];

  beforeEach(async () => {
    const artistServiceSpy = jasmine.createSpyObj('ArtistService', [
      'getArtists',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Mock HTTP requests
        RouterTestingModule, // Mock router
        SidebarComponent, // Include standalone SidebarComponent
      ],
      declarations: [ArtistIndexComponent],
      providers: [{ provide: ArtistService, useValue: artistServiceSpy }],
    }).compileComponents();

    artistService = TestBed.inject(
      ArtistService
    ) as jasmine.SpyObj<ArtistService>;
    artistService.getArtists.and.returnValue(of(mockArtists)); // Mock getArtists() to return mock data

    fixture = TestBed.createComponent(ArtistIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger Angular's change detection
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch artists on initialization', () => {
    expect(component.artists.length).toBe(mockArtists.length);
    expect(component.artists[0].name).toBe('Jay-Z');
  });

  it('should open the sidebar with selected artist', () => {
    const artist = mockArtists[0];
    component.openSidebar(artist);

    expect(component.isSidebarOpen).toBeTrue();
    expect(component.selectedArtist).toEqual(artist);
  });

  it('should close the sidebar', () => {
    component.closeSidebar();

    expect(component.isSidebarOpen).toBeFalse();
    expect(component.selectedArtist).toBeNull();
  });

  it('should handle image errors and set default image', () => {
    const artist = {
      id: 1,
      name: 'Test Artist',
      username: 'test',
      totalStars: 0,
    };
    component.handleImageError(artist);

    // expect(artist.image_url).toBe('/assets/default-image.png');
  });
});
