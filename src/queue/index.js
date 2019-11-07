import BullQueue from 'bull';

import config from '../config';
import logger from '../logger';

config.defaults('queue', {
  enabled: config._env.get('QUEUE_ENABLED', true),
  redis: {
    port: config._env.get('QUEUE_REDIS_PORT', 'localhost'),
    host: config._env.get('QUEUE_REDIS_HOST', 6379),
    pass: config._env.get('QUEUE_REDIS_PASS', undefined),
  },
});

const QueueObject = {
  /**
   * A map with all loaded queues.
   *
   * @type {Object<string,Queue>}
   */
  _queues: {},

  /**
   * Mounts redis connection config object
   *
   * @type {Object<string,*>}
   */
  get _redisConfig() {
    return {
      port: config.get('queue.redis.port'),
      host: config.get('queue.redis.host'),
      pass: config.get('queue.redis.pass'),
    };
  },

  /**
   * Returns an array of bull queues to be used by some bull frontend.
   *
   * @type {BullQueue.Queue[]}
   */
  get queuesArray() {
    return Object.values(this._queues).map(queue => queue.bull);
  },

  /**
   * Adds data to a queue.
   *
   * @param {string} key The queue name/key.
   * @param {object} data
   * @param {BullQueue.JobOptions} options
   *
   * @returns {Promise<BullQueue.Job<any>>}
   */
  add(key, data, options = null) {
    const queue = this._queues[key];

    return queue.bull.add(data, options || queue.options);
  },

  /**
   * Adds a new queue.
   *
   * @param {Queue} queue
   *
   * @returns {ThisType}
   */
  queue(queue) {
    if (this._queues[queue.key])
      throw new Error('You are trying to create a duplicated queue.');

    this._queues[queue.key] = queue;

    return this;
  },

  /**
   * Initialized all bull queues.
   *
   * @returns {void}
   */
  init() {
    return Object.values(this._jobs).forEach(job => {
      if (this._queues[job.key].bull) return;

      this._queues[job.key] = {
        bull: new BullQueue(job.key, this._redisConfig),
        name: job.key,
        handle: job.handle,
        key: job.key,
        options: job.options,
      };
    });
  },

  /**
   * Starts processing all bull queues.
   *
   * @returns {void}
   */
  process() {
    return Object.values(this._queues).forEach(queue => {
      queue.bull.process(queue.handle);

      queue.bull.on('failed', (job, err) => {
        logger.error({
          msg: `The ${queue.key} queue failed.`,
          queue: queue.key,
          data: job.data,
          error: err,
        });
      });
    });
  },
};

export default QueueObject;

/**
 * @typedef {object} Queue
 *
 * @property {string} key The Queue key
 * @property {function(object):null} handle The handle function
 * @property {string} [name] The Queue name
 * @property {BullQueue.Queue} [bull] The Bull Queue object
 * @property {BullQueue.JobOptions} [options] The Bull Queue options
 */
