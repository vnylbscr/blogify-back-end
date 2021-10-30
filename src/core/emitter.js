import emitter from 'events';

const { EventEmitter } = emitter;

const MyEmitter = new EventEmitter();

MyEmitter.on('updatedPost', (data) => {
   console.log('event data is here', data);
});

export default MyEmitter;
