import 'bootstrap/dist/css/bootstrap.min.css';
import './stylesheets/main.css';

import Navbar from './Components/Navbar/Navbar';
import Router from './Components/Router/Router';
import { initializeAudio } from './utils/audioManager';

import audioPath from './assets/sound/bg-sound.mp3';

initializeAudio(audioPath);

Navbar();

Router();
