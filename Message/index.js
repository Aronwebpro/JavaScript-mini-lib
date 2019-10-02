const styles = require('./message.css');

const Message = (function constructor() {
    const component =  {
        body: document.getElementsByTagName('body')[0],
        container: document.createElement('div'),
        /**
         * Mount Message container and styles to DOM
         */
        mount: function() {
            // Add container Class
            this.container.setAttribute('class', 'flash-message');

            // Append Styles
            this.container.appendChild(styles);

            //Append Message Container To Body
            this.body.appendChild(this.container);

            //Set Flag to avoid repetition
            this.mounted = true;
        },
        /**
         * Create Message Content container
         * @param type
         * @param msg
         */
        create: function (type, msg) {
            // Check if component is mounted
            if (!this.mounted) {
                this.mount();
            }

            // Icon
            const icon = this.createIcon(type);

            // Text
            const text = document.createElement('span');
            text.textContent = msg;

            // Content element
            const content = document.createElement('div');
            content.setAttribute('class', 'flash-message-inner-content');
            content.appendChild(icon);
            content.appendChild(text);

            // Inner element
            const inner = document.createElement('div');
            inner.setAttribute('class', 'flash-message-inner');
            inner.classList.add('class', 'appear-animation');
            inner.appendChild(content);

            //Message Container
            this.container.appendChild(inner);

            // Set Time out to remove Message
            setTimeout(this.remove.bind(this, inner), 3000);
        },
        /**
         * Destroy Message Content container
         * @param el
         * @returns {Node}
         */
        destroy: function(el) {
            return this.container.removeChild(el);
        },
        /**
         * Set Remove Animation
         * @param el
         * @returns {number}
         */
        remove: function(el) {
            el.classList.add('remove-animation');
            return setTimeout(this.destroy.bind(this, el), 200);
        },
        /**
         * Create Message Icon by message type
         * @param type
         * @returns {HTMLImageElement}
         */
        createIcon: function(type) {
            const icon = document.createElement('img');
            icon.setAttribute('class', 'icon');
            switch (type) {
                case 'error' :
                    icon.setAttribute('src', '/cross.svg');
                    break;
                case 'success' :
                    icon.setAttribute('src', '/success.svg');
                    break;
                default :
                    icon.setAttribute('src', '/default.svg');
            }
            return icon;
        }
    };
    /**
     * Return Message Object and lock properties
     */
    return Object.freeze({
        success: function(message) {
            return component.create('success', message);
        },
        error: function(message) {
            return component.create('error', message);
        },
        default: function(message) {
            return component.create('default', message);
        },
    });
})();

export default Message;

